import { Sequelize } from 'sequelize';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize & {
      checkConnection(): Promise<{
        status: 'connected' | 'disconnected' | 'error';
        message: string;
        timestamp: Date;
      }>;
      testConnection(): Promise<void>;
      getConnectionStatus(): {
        isConnected: boolean;
        lastConnected?: Date;
        lastError?: Error;
      };
    };
  }
}

interface SequelizePluginOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  dialect?: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
  logging?: boolean | ((sql: string) => void);
  connectionTimeout?: number;
  reconnect?: {
    max?: number;
    delay?: number;
  };
}

class ExtendedSequelize extends Sequelize {
  private _connectionStatus = {
    isConnected: false,
    lastConnected: undefined as Date | undefined,
    lastError: undefined as Error | undefined
  };

  async checkConnection() {
    const startTime = Date.now();
    try {
      await this.authenticate();

      const connectionTime = Date.now() - startTime;
      this._connectionStatus = {
        isConnected: true,
        lastConnected: new Date(),
        lastError: undefined
      };

      return {
        status: 'connected' as const,
        message: `Database connected successfully. Latency: ${connectionTime}ms`,
        timestamp: new Date()
      };
    } catch (error) {
      this._connectionStatus = {
        isConnected: false,
        lastConnected: this._connectionStatus.lastConnected,
        lastError: error instanceof Error ? error : new Error(String(error))
      };

      return {
        status: 'error' as const,
        message: `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };
    }
  }

  async testConnection(timeout = 5000) {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Connection test timed out'));
      }, timeout);

      this.authenticate()
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  getConnectionStatus() {
    return { ...this._connectionStatus };
  }
}

// Singleton pattern for accessing sequelize instance outside of Fastify context
let sequelizeInstance: ExtendedSequelize;

export function initializeSequelizeInstance(instance: ExtendedSequelize) {
  sequelizeInstance = instance;
}

export function getSequelize(): ExtendedSequelize {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance not initialized. Make sure database connection is established.');
  }
  return sequelizeInstance;
}

// Sequelize Fastify Plugin
const sequelizePlugin: FastifyPluginAsync<SequelizePluginOptions> = fp(async (fastify, options: any) => {
  // Read from environment variables if options aren't provided
  const sequelize = new ExtendedSequelize({
    host: options?.host || process.env.POSTGRES_HOST || 'localhost',
    port: options?.port || parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: options?.username || process.env.POSTGRES_USER || 'postgres',
    password: options?.password || process.env.POSTGRES_PASSWORD || '',
    database: options?.database || process.env.POSTGRES_DB || '',
    dialect: options?.dialect || 'postgres',
    logging: options?.logging || false,
    define: {
      timestamps: false,
      underscored: true
    },
    pool: {
      max: 300,
      min: 0,
      acquire: options.connectionTimeout || 150000,
      idle: 40000
    },
    retry: {
      max: options.reconnect?.max || 3,
      backoffBase: options.reconnect?.delay || 1000
    }
  });


  try {
    // Perform initial connection check
    await sequelize.sync({ alter: true })
    const connectionResult = await sequelize.checkConnection();
    fastify.log.info(connectionResult.message);

    // Initialize the singleton instance for global access
    initializeSequelizeInstance(sequelize);
    // Decorate fastify instance with extended sequelize
    fastify.decorate('sequelize', sequelize);

    // Add a hook to close the connection when server closes
    fastify.addHook('onClose', async () => {
      await sequelize.close();

    });
  } catch (error: any) {
    fastify.log.error('Unable to connect to the database:', error);
    throw error;
  }
});

export default sequelizePlugin;
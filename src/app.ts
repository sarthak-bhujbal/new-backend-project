import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import routes from "./routes";
import { configureJWT } from './config/jwt';
import fastifyJwt from '@fastify/jwt';
import { initializeDBConnection, sequelize } from './config/instance';
import errorHandler from './middleware/error-handler';
import registerModels from './migrations/migration';
import multipart from "@fastify/multipart";
import { createDefaultSuperAdmin } from './utilities/super-user.util';

dotenv.config();

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  ignoreTrailingSlash: true
});

const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDBConnection();
    await sequelize.sync({ alter: false });
    // Register models
    registerModels();

    // Create default super admin
    createDefaultSuperAdmin();

    // Register plugins
    await app.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // JWT authentication
    await app.register(fastifyJwt, configureJWT());

    // Set up global error handler
    app.setErrorHandler(errorHandler);

app.register(multipart);

    // Register all routes
    routes.forEach((route: any) => {
      app.route({
        ...route,
        url: `/v1/api${route.url}`,
      });
    });

    // Root route for health check
    app.get('/', async (request, reply) => {
      return { status: 'ok', version: process.env.npm_package_version };
    });

    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    app.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();

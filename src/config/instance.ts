import { Sequelize } from "sequelize";
import { config } from "./env.config";
 
export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect as any,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 20000,
    },
  }
);
 
export const initializeDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
    }
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
};

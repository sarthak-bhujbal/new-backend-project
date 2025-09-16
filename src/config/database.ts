import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "baap-lms-dev",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "+2wa#-4SHNKtJ8V",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);



export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
};

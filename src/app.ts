import Fastify from "fastify";
import { connectDB, sequelize } from "./config/database";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  await connectDB();
  // Sync Sequelize models with the database
  await sequelize.sync({ alter: true });

  // Swagger Docs
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Credit Portal",
        description: "",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  const routes = (await import("./routes/index")).default;
  app.register(routes, { prefix: "/lms/v1/api" });
  return app;
};

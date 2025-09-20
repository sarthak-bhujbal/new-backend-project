import { FastifyInstance } from "fastify";
import { DocumentController } from "../controllers/document.controller";

const documentController = new DocumentController();

async function documentRoutes(app: FastifyInstance) {
  app.post("/documents/upload", documentController.upload);
}

export default documentRoutes;

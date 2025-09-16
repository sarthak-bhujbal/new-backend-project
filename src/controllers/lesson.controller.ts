import { FastifyRequest, FastifyReply } from "fastify";
import { lesson } from "../models/lesson.model";
import { lessonRepsitory } from "../repositories/lesson.repository";
import { lessonInterface } from "../interfaces/lesson.interface";

const lessonRepo = new lessonRepsitory();

export class lessonController {
  async getAllLesson(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id } = req.params as { client_id: string };
      const { page, limit, course_id } = req.query as { page?: string; limit?: string; course_id?: string };

      const lesson = await lessonRepo.getLesson(Number(page), Number(limit), {
        client_id,
        course_id,
      });

      return reply.status(200).send(lesson);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch  lesson",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getLessonById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id, id } = req.params as { id: string; client_id: string };
      const lesson = await lessonRepo.getlessonById(client_id, id);

      if (!lesson) {
        return reply.code(200).send({ message: " lesson not found" });
      }
      return reply
        .code(200)
        .send({ data: lesson, message: " lesson fetched successfully" });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch lesson",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async createLesson(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id } = req.params as { client_id: string };
      const body = req.body as lessonInterface;
      const data = { ...body, client_id };
      const lesson = await lessonRepo.createLesson(data);
      return reply.code(201).send({
        data: {
          id: lesson?.id,
        },
        message: " lesson created successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to create  lesson",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async updateLesson(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as Partial<lesson>;

      const updated = await lessonRepo.updateLesson(id, body);

      if (!updated) {
        return reply.code(200).send({ message: "lesson not found" });
      }

      return reply.send({
        data: updated?.id,
        message: "lesson updated successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to update lesson",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteLesson(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await lessonRepo.deleteLesson(id);

      if (!deleted) {
        return reply.code(404).send({ message: "lesson not found" });
      }

      return reply.send({ message: "lesson deleted" });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to delete lesson",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
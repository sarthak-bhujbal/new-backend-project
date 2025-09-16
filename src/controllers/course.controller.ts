import { FastifyReply, FastifyRequest } from "fastify";
import { CourseRepository } from "../repositories/course.repository";
import { Course } from "../models/course.model";
import { CourseInterface } from "../interfaces/course.interface";

const courseRepo = new CourseRepository();
// type CreateCourseBody = Partial<Course>;

export class CourseController {
  async getCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id, id } = req.params as { id: string; client_id: string };
      const course = await courseRepo.getCourseById(client_id, id);

      if (!course || !course.length) {
        return reply.code(200).send({ message: "Course not found" });
      }
      return reply
        .code(200)
        .send({ data: course?.[0], message: "Course fetched successfully" });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async createCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id } = req.params as { client_id: string };
      const body = req.body as CourseInterface;
      const data = { ...body, client_id };
      const course = await courseRepo.createCourse(data);
      return reply.code(201).send({
        data: {
          id: course?.id,
        },
        message: "Course created successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to create course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async updateCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as Partial<Course>;

      const updated = await courseRepo.updateCourse(id, body);

      if (!updated) {
        return reply.code(200).send({ message: "Course not found" });
      }

      return reply.send({
        data: updated?.id,
        message: "Course updated successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to update course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await courseRepo.deleteCourse(id);

      if (!deleted) {
        return reply.code(404).send({ message: "Course not found" });
      }

      return reply.send({ message: "Course deleted" });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to delete course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getAllCourses(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id } = req.params as { client_id: string };
      const { page, limit } = req.query as { page?: string; limit?: string };

      const courses = await courseRepo.getAllCourses(
        Number(page),
        Number(limit),
        { client_id }
      );

      return reply.status(200).send(courses);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch courses",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

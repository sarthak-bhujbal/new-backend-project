import { FastifyReply, FastifyRequest } from "fastify";
import { AssiginCourseRepositorie } from "../repositories/assignCourse.repositorie";

const repositorie = new AssiginCourseRepositorie();
// type CreateCourseBody = Partial<AssignedCourseModel>;

export class AssiginCourseController {
  async createAssiginCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id } = req.params as { client_id: string };
      const { course_id, user_id } = req.body as {
        course_id: string[];
        user_id: string[];
      };

      const record = await repositorie.createAssignCourse({
        course_id,
        user_id,
        client_id,
      });

      return reply.code(201).send({
        data: { id: record.id },
        message: "Courses Assigned Successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to Courses Assigned",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getCourseByUserId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id, user_id } = req.params as {
        client_id: string;
        user_id: string;
      };

      const course = await repositorie.getCourseByUserId(client_id, user_id);

      if (!course || course.length === 0) {
        return reply.code(200).send({
          message: "Assigned course not found for this user",
        });
      }

      return reply.code(200).send({
        data: course,
        message: "Course fetched successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch Assigned course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  
  async getCourse(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { client_id, course_id } = req.params as {
        client_id: string;
        course_id: string;
      };

      const course = await repositorie.getCourseById(client_id, course_id);

      if (!course || course.length === 0) {
        return reply.code(200).send({
          message: "course not found ",
        });
      }

      return reply.code(200).send({
        data: course,
        message: " course fetched successfully",
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        message: "Failed to fetch course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

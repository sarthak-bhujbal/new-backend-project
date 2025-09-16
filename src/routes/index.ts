import { FastifyInstance, FastifyPluginOptions } from "fastify";
import courseRoutes from "./course.routes";
import sectionRoutes from "./section.routes";
import lessonRoutes from "./lesson.routes";
import enrollmentRoutes from "./enrollment.routes";
import quizRoutes from "./quizze.routes";
import reviewsRoutes from "./reviews.routes";
import assignCourseRoutes from "./assignCourse.route";
import completedAssignCourseRoutes from "./completedAssignCourse.routes";

export default async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
  fastify.register(courseRoutes, { prefix: "/client/:client_id" });
  fastify.register(lessonRoutes, { prefix: "/client/:client_id" });
  fastify.register(sectionRoutes, { prefix: "/client/:client_id" });
  fastify.register(assignCourseRoutes, { prefix: "/client/:client_id" });
  fastify.register(completedAssignCourseRoutes,{ prefix: "/client/:client_id" });
  // fastify.register(enrollmentRoutes, { prefix: "/client/:client_id" });
  // fastify.register(quizRoutes, { prefix: "/client/:client_id" });
  // fastify.register(reviewsRoutes, { prefix: "/client/:client_id" });
}

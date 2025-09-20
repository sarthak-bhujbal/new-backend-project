import { FastifyRequest, FastifyReply } from "fastify";
import TopicService from "../services/topic.service";
import { ITopic } from "../interfaces/topic interface";

class TopicController {
  private topicservice: any;

  constructor() {
    this.topicservice = TopicService;
  }
  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = request.body as ITopic;
      const topic = await this.topicservice.createTopic(data);
      reply.code(201).send(topic);
    } catch (error) {
      reply.code(500).send({ message: "Failed to create topic", error });
    }
  }

  getById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const topic = await this.topicservice.getTopicById(id);
      if (!topic) return reply.code(404).send({ message: "Topic not found" });
      reply.send(topic);
    } catch (error) {
      reply.code(500).send({ message: "Error fetching topic", error });
    }
  }

  getAlltopics = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10, search = "" } = request.query as any;

      const offset = (Number(page) - 1) * Number(limit); // ✅ calculate offset

      const result = await this.topicservice.getAllTopics(
        Number(limit),
        offset,
        search
      );

      return reply.status(200).send({
        status_code: 200,
        message: "All topics fetched successfully",
        ...result,
        page: Number(page),
      });
    } catch (error) {
      console.error("Error fetching topics:", error);
      reply.code(500).send({ message: "Error fetching topics", error });
    }
  };


  update = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as Partial<ITopic>;
      const updated = await this.topicservice.updateTopic(id, data);
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Error updating topic", error });
    }
  }

  getAllTrendingTopics = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10, search = "" } = request.query as any;
      const offset = (Number(page) - 1) * Number(limit);

      const result = await this.topicservice.getAllTrending(
        Number(limit),
        offset,
        search
      );

      return reply.status(200).send({
        status_code: 200,
        message: "All topics fetched successfully",
        ...result
      });
    } catch (error) {
      reply.code(500).send({ message: "Error fetching topics", error });
    }
  }

  getAllNewsbyTopicId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10 } = req.query as any;
      const {topic_id } = req.params as {topic_id: string };
      const offset = (Number(page) - 1) * Number(limit);

      const result = await this.topicservice.getAllNewsbyTopicId(String(topic_id), offset, Number(limit));

      return reply.status(200).send({
        status_code: 200,
        message: "All News fetched successfully",
        ...result
      });
    } catch (error: any) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  }

  getAllSubjectsbyTopicId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10 } = req.query as any;
      const {topic_id } = req.params as {topic_id: string };
      const offset = (Number(page) - 1) * Number(limit);

      const result = await this.topicservice.getAllSubjectsbyTopicId(String(topic_id), offset, Number(limit));

      return reply.status(200).send({
        status_code: 200,
        message: "All Subjects fetched successfully",
        ...result
      });
    } catch (error: any) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  }

  getAllQuestionsbyTopicId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10 } = req.query as any;
      const {topic_id } = req.params as { topic_id: string };
      const offset = (Number(page) - 1) * Number(limit);

      const result = await this.topicservice.getAllQuestionsbyTopicId(String(topic_id), offset, Number(limit));

      return reply.status(200).send({
        status_code: 200,
        message: "All Questions fetched successfully",
        ...result
      });
    } catch (error: any) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  }

  getAllReferncesbyTopicId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 10 } = req.query as any;
      const {topic_id } = req.params as { topic_id: string };
      const offset = (Number(page) - 1) * Number(limit);

      const result = await this.topicservice.getAllReferencesbyTopicId( String(topic_id), offset, Number(limit));

      return reply.status(200).send({
        status_code: 200,
        message: "All References fetched successfully",
        ...result
      });
    } catch (error: any) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  }

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await this.topicservice.deleteTopic(id);
      reply.send({ message: "Topic deleted successfully" });
    } catch (error) {
      reply.code(500).send({ message: "Error deleting topic", error });
    }
  }
}

export default new TopicController();

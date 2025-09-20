import TopicRepository from "../repositories/topic.repo";
import { ITopic } from "../interfaces/topic interface";
import SubjectModel from "../models/subject.model";
import ReferenceModel from "../models/reference.model";
import NewsModel from "../models/news.model";
import QuestionModel from "../models/question.model";

class TopicService {
  private topicRepository: any;

  constructor() {
    this.topicRepository = TopicRepository;
  }
  async createTopic(data: ITopic) {
    const topic = await TopicRepository.create(data);

    if (data.subject && Array.isArray(data.subject)) {
      for (const subject of data.subject) {
        await SubjectModel.create({
          topic_id: topic.id,
          title: subject,
          from_topic: true,
          created_by: null
        });
      }
    }

    if (data.news && Array.isArray(data.news)) {
      for (const news of data.news) {
        await NewsModel.create({
          topic_id: topic.id,
          title: news,
          from_topic: true,
          created_by: null
        });
      }
    }

    if (data.question && Array.isArray(data.question)) {
      for (const question of data.question) {
        await QuestionModel.create({
          topic_id: topic.id,
          title: question,
          from_topic: true,
          created_by: null
        });
      }
    }

    if (data.reference && Array.isArray(data.reference)) {
      for (const reference of data.reference) {
        await ReferenceModel.create({
          topic_id: topic.id,
          title: reference,
          from_topic: true,
          created_by: null
          
        });
      }
    }
    return topic;
  }

  async getTopicById(id: string) {
    return await this.topicRepository.findById(id);
  }

  async getAllTopics(limit: number, offset: number, search: string) {
    const { count, rows } = await this.topicRepository.findAll(limit, offset, search);

    return {
      count: count,
      totalPages: Math.ceil(count / limit),
      page: Math.floor(offset / limit) + 1,
      limit: limit,
      data: rows
    };
  }

  async updateTopic(id: string, data: Partial<ITopic>) {
    return await this.topicRepository.update(id, data);
  }

  async getAllTrending(limit: number, offset: number, search: string) {
    const { count, rows } = await this.topicRepository.findAllTrending(limit, offset, search);

    return {
      count: count,
      totalPages: Math.ceil(count / limit),
      page: Math.floor(offset / limit) + 1,
      limit: limit,
      data: rows
    };
  }

  async getAllNewsbyTopicId(topic_id: string, offset: number, limit: number) {

    const { count, rows } = await this.topicRepository.findAllNewsBytopicId( topic_id, limit, offset);

    return {
        count: count,
        totalPages: Math.ceil(count / limit),
        page: Math.floor(offset / limit) + 1,
        limit: limit,
      data: rows,
    };
  }

    async getAllSubjectsbyTopicId( topic_id: string, offset: number, limit: number) {

    const { count, rows } = await this.topicRepository.findAllSubjectBytopicId( topic_id, limit, offset);

    return {
        count: count,
        totalPages: Math.ceil(count / limit),
        page: Math.floor(offset / limit) + 1,
        limit: limit,
      data: rows,
    };
  }
    async getAllQuestionsbyTopicId( topic_id: string, offset: number, limit: number) {

    const { count, rows } = await this.topicRepository.findAllQuestionBytopicId( topic_id, limit, offset);

    return {
        count: count,
        totalPages: Math.ceil(count / limit),
        page: Math.floor(offset / limit) + 1,
        limit: limit,
      data: rows,
    };
  }
    async getAllReferencesbyTopicId( topic_id: string, offset: number, limit: number) {

    const { count, rows } = await this.topicRepository.findAllReferenceBytopicId(topic_id, limit, offset);

    return {
        count: count,
        totalPages: Math.ceil(count / limit),
        page: Math.floor(offset / limit) + 1,
        limit: limit,
      data: rows,
    };
  }
  async deleteTopic(id: string) {
    return await this.topicRepository.delete(id);
  }
}

export default new TopicService();

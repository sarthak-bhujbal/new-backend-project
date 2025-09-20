import { ITopic } from "../interfaces/topic interface";
import { Op } from "sequelize";
import TopicModel from "../models/topic.model";
import NewsModel from "../models/news.model";
import SubjectModel from "../models/subject.model";
import QuestionModel from "../models/question.model";
import ReferenceModel from "../models/reference.model";


class TopicRepository {
  private topicmodel: any;

  constructor() {
    this.topicmodel = TopicModel;
  }
  async create(data: ITopic) {
    return await this.topicmodel.create(data as any);
  }

  async findById(id: string) {
    return await this.topicmodel.findByPk(id);
  }

  async findAll(limit: number, offset: number, search: string) {
    return await this.topicmodel.findAndCountAll({
      where: search ? { name: { [Op.iLike]: `%${search}%` } } // case-insensitive search
        : {},
      attributes: ["id","name", "created_on", "created_by"], 
      order: [["created_on", "DESC"]], 
      limit,
      offset,
    });
  }

  async findAllTrending(limit: number, offset: number, search: string) {
    return await this.topicmodel.findAndCountAll({
      where: search ? { name: { [Op.iLike]: `%${search}%` } }
        : {},
      attributes: ["id","name", "created_on", "created_by"], 
      limit,
      offset,
    });
  }
async update(id: string, data: Partial<ITopic>) {
  await this.topicmodel.update(data, { where: { id } });   
  return this.findById(id);
}
async findAllNewsBytopicId(topic_id: string, limit: number, offset: number) {
    return await NewsModel.findAndCountAll({
      where: {topic_id },
      limit,
      offset,
      order: [
        ["from_topic", "DESC"],   // from_topic true first
        ["created_on", "DESC"],   // latest first
      ],
      attributes: ["id", "topic_id","title", "from_topic", "created_on", "created_by"],
    });
  }
  async checkNewsExists(topic_id: string) {
    return await NewsModel.findByPk(topic_id);
  }

  async findAllSubjectBytopicId( topic_id: string, limit: number, offset: number) {
    return await SubjectModel.findAndCountAll({
      where: { topic_id },
      limit,
      offset,
      order: [
        ["from_topic", "DESC"],   // from_topic true first
        ["created_on", "DESC"],   // latest first
      ],
      attributes: ["id", "topic_id","title", "from_topic", "created_on", "created_by"],
    });
  }
  async checkSubjectExists(topic_id: string) {
    return await SubjectModel.findByPk(topic_id);
  }

  async findAllQuestionBytopicId( topic_id: string, limit: number, offset: number) {
    return await QuestionModel.findAndCountAll({
      where: {  topic_id },
      limit,
      offset,
      order: [
        ["from_topic", "DESC"],   // from_topic true first
        ["created_on", "DESC"],   // latest first
      ],
      attributes: ["id", "topic_id", "title", "from_topic", "created_on", "created_by"],
    });
  }
  async checkQuestionExists(topic_id: string) {
    return await QuestionModel.findByPk(topic_id);
  }

  async findAllReferenceBytopicId( topic_id: string, limit: number, offset: number) {
    return await ReferenceModel.findAndCountAll({
      where: {  topic_id },
      limit,
      offset,
      order: [
        ["from_topic", "DESC"],   // from_topic true first
        ["created_on", "DESC"],   // latest first
      ],
      attributes: ["id", "topic_id", "title", "from_topic", "created_on", "created_by"],
    });
  }
  async checkReferenceExists(topic_id: string) {
    return await ReferenceModel.findByPk(topic_id);
  }


  async delete(id: string) {
    return await this.topicmodel.destroy({ where: { topick_id: id } });
  }
}

export default new TopicRepository();

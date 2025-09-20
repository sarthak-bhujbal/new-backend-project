import  OpinionRepository  from "../repositories/opinion.repo";
import  OpinionInterface  from "../interfaces/opinion.interface";

export default class OpinionService {
  private repo: OpinionRepository;

  constructor() {
    this.repo = new OpinionRepository();
  }

  async createOpinion(data: OpinionInterface) {
    return await this.repo.createOpinion(data);
  }

  async getOpinionById(id: string) {
    return await this.repo.findOpinionById(id);
  }

  async getAllOpinions() {
    return await this.repo.findAllOpinions();
  }

  async updateOpinion(id: string, data: Partial<OpinionInterface>) {
    return await this.repo.updateOpinion(id, data);
  }

  async deleteOpinion(id: string) {
    return await this.repo.deleteOpinion(id);
  }
}

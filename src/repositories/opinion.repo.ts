import OpinionModel from "../models/opinion.model";
import OpinionInterface from "../interfaces/opinion.interface";

export default class OpinionRepository {
  async createOpinion(data: OpinionInterface) {
    return await OpinionModel.create(data as any);
  }

  async findOpinionById(id: string) {
    return await OpinionModel.findByPk(id);
  }

  async findAllOpinions() {
    return await OpinionModel.findAll({
      where: {is_deleted: false}
    });
  }

  async updateOpinion(id: string, data: Partial<OpinionInterface>) {
    const opinion = await OpinionModel.findByPk(id);
    if (!opinion) return null;
    await opinion.update(data);
    return opinion;
  }

async deleteOpinion(id: string) {
  return await OpinionModel.update(
    { is_deleted: true, updated_on: Date.now() },
    { where: { id } }
  );
}
}

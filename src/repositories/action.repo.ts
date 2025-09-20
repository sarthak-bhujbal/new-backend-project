import ActionModel from "../models/action.model";

class ActionRepository {
  private model = ActionModel;

  async createAction(actionData: any) {
    return this.model.create({
      ...actionData,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  async findActionByShortCode(short_code: string, module_id: string, permission_id: string) {
    return this.model.findOne({
      where: {
        short_code,
        module_id,
        permission_id,
      },
    });
  }

  async getAllActions() {
    return this.model.findAll();
  }

  async getActionById(id: string) {
    return this.model.findByPk(id);
  }
}

export default ActionRepository;

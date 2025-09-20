import UserModel from "../models/user.model";
import UserInterface from "../interfaces/user.interface";
class UserRepository {
  private userModel: any;

  constructor() {
    this.userModel = UserModel;
  }
  async createUser(data: UserInterface) {
    return await this.userModel.create(data);
  }

  async getUserById(id: string) {
    return await this.userModel.findOne({ where: { id } });
  }

  async getAllUsers(limit: number, offset: number, tenant_id: string) {
    const results: any = {limit, offset};

    if(tenant_id){
      results.where = {tenant_id};
    } 
    return await this.userModel.findAndCountAll(results);
  }
}

export default new UserRepository();

import RoleModel from '../models/role.model';
import { CreateRoleInput } from '../interfaces/role.interface';

class RoleRepository {
  async create(roleData: CreateRoleInput) {
    return await RoleModel.create(roleData);
  }

  async findByTenant(tenant_id: string) {
    return await RoleModel.findAll({ where: { tenant_id } });
  }

  async findById(id: string) {
    return await RoleModel.findByPk(id);
  }

  async updateRole(id: string, updateData: Partial<CreateRoleInput>) {
    return await RoleModel.update(updateData, { where: { id } });
  }

  async deleteRole(id: string) {
    return await RoleModel.destroy({ where: { id } });
  }
}

export default new RoleRepository();

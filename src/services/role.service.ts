import { CreateRoleInput } from '../interfaces/role.interface';
import roleRepository from '../repositories/role.repo';

class RoleService {
  public async createRole(roleData: CreateRoleInput) {
    try {
      const newRole = await roleRepository.create({
        tenant_id: roleData.tenant_id,
        name: roleData.name,
        short_code: roleData.short_code,
        description: roleData.description,
        client_id: roleData.client_id,
        is_system: roleData.is_system || false,
        is_default: roleData.is_default || false,
        created_by: roleData.created_by,
        updated_by: roleData.updated_by,
      });

      return { success: true, role: newRole };
    } catch (error) {
      console.error(`Error creating role: ${error}`);
      return { success: false, message: 'Error creating role', error };
    }
  }
}

export default new RoleService();

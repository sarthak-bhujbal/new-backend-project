import PermissionRepository from "../repositories/permission.repo";

class PermissionService {
  private repo: any;

  constructor() {
    this.repo = new PermissionRepository();
  }

  async createPermission(permissionData: any) {
    try {
      const newPermission = { id: Date.now(), ...permissionData };
      console.info(`Permission created with ID: ${newPermission.id}`);
      return newPermission;
    } catch (error) {
      console.error(`Error creating permission: ${error}`);
      throw error;
    }
  }
}

export default PermissionService;

// src/repositories/permission.repo.ts
import Permission from "../models/permission.model";

class PermissionRepository {
  async create(permissionData: any) {
    try {
      const createdPermission = await Permission.create(permissionData);
      return createdPermission;
    } catch (error) {
      console.error("Repository - Error creating permission:", error);
      throw error;
    }
  }
}

export default PermissionRepository;

import UserMappingModel from '../models/userMapping.model';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';
import RolePermissionModel from '../models/role-permission.model';
import PermissionModel from '../models/permission.model';

class AuthRepository {
    userModel: any;
    userMappingModel: any;
    roleModel: any;
    rolePermissionModel: any;
    permissionModel: any;

    constructor() {
        this.userModel = UserModel;
        this.userMappingModel = UserMappingModel;
        this.roleModel = RoleModel;
        this.rolePermissionModel = RolePermissionModel;
        this.permissionModel = PermissionModel;
    }

    async findUserByEmail(email: string) {
        return this.userModel.findOne({
            where: { email }
        });
    }

    async findRoleByName(name: string) {
        return await this.roleModel.findOne({
            where: { name }
        });
    }

    async findUserByPhone(phone: string) {
        return await this.userModel.findOne({
            where: { phone }
        });
    }

    async unlockUser(userId: string) {
        return await this.userModel.update(
            { status: 'active', login_attempts: 0, locked_until: null },
            { where: { id: userId } }
        );
    }

    async updateUser(userId: string, data: any) {
        return await this.userModel.update(data, { where: { id: userId } });
    }

    async findUserMappings(userId: string) {
        return await this.userMappingModel.findAll({
            where: { user_id: userId, status: 'active' },
            include: [{ model: RoleModel, as: 'role' }]
        });
    }

    async findRolePermissions(roleId: string) {
        return await this.rolePermissionModel.findAll({
            where: { role_id: roleId },
            include: [{ model: PermissionModel, as: 'permission' }]
        });
    }

    async updateUserMapping(mappingId: string, data: any) {
        return await this.userMappingModel.update(data, { where: { id: mappingId } });
    }

    async updateUserMappingsByUserId(userId: string, data: any) {
        return await this.userMappingModel.update(data, { where: { user_id: userId, device_id: null } });
    }

    async findUserById(userId: string) {
        return await this.userModel.findOne({ where: { id: userId } });
    }

    async findActiveUserMappings(userId: string) {
        return this.userMappingModel.findAll({
            where: { user_id: userId, status: 'active' }
        });
    }
}

export default AuthRepository;

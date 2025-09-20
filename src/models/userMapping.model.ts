import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import RoleModel from "./role.model";
import TenantModel from "./tenant.model";
import UserModel from "./user.model";

class UserMappingModel extends Model {
    id: any;
    tenant!: any;
    role!: any;
    user: any;
    password!: any;
    tenant_id!: string;
    user_id!: string;
    role_id!: string;
}

UserMappingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_id:{
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      defaultValue: "active",
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_mappings",
    timestamps: false,
  }
);

UserMappingModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });
UserMappingModel.belongsTo(TenantModel, { foreignKey: "tenant_id", as: "tenant" });
UserMappingModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
RoleModel.hasMany(UserMappingModel, { foreignKey: "role_id", as: "userMappings" });
TenantModel.hasMany(UserMappingModel, { foreignKey: "tenant_id", as: "userMappings" });
UserModel.hasMany(UserMappingModel, { foreignKey: "user_id", as: "user_mappings" });
export default UserMappingModel;

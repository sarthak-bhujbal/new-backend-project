import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import TenantModel from "./tenant.model";

class RoleModel extends Model {
  id! : string;
  name!: string;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TenantModel,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    short_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: false,
    underscored: true,
  }
);
export default RoleModel;

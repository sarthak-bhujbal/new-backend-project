import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import Tenant from "./tenant.model";
import { Json } from "sequelize/types/utils";

class TenantConfiguration extends Model {
  declare id: string;
  declare type: string;
  declare sub_type?: string;
  declare value: Json;
  declare location_id?: string;
  declare department_id?: string;
  declare tenant_id: string;
  declare created_by: string;
  declare updated_by: string;
  declare created_at: Date;
  declare updated_at: Date;

  static associate?: (models: Record<string, ModelStatic<Model>>) => void;

  static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sub_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tenant_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: Tenant,
            key: "id",
          },
        },
        value: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        updated_by: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "tenant_configuration",
        timestamps: false,

      }
    );
  }
}

export default TenantConfiguration;

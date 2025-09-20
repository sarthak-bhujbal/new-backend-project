import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";

class PermissionModel extends Model {
  id!: string;
  name!: string;
  code!: string;
  description!: string | null;
  module_id!: string | null;
  category!: string | null;
  is_system!: boolean;
  created_at!: Date;
  updated_at!: Date;
  created_by!: string | null;
  updated_by!: string | null;
  client_id!: string | null;
}

PermissionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // module_id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //     model: "modules",
    //     key: "id",
    //   },
    // },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "tenants",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "permissions",
    timestamps: false,
   hooks: {
            beforeValidate: (instance: any) => {
                for (const key in instance.dataValues) {
                    if (instance.dataValues[key] === '') {
                        instance.dataValues[key] = null;
                    }
                }
            },
            beforeSave: (instance: any) => {
                // Permission model doesn't have date_of_birth field
                // This hook can be simplified as it's not needed for this model
            }
        },
  }
);

export default PermissionModel;

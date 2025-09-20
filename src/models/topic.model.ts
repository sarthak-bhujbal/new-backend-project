import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import TenantModel from "./tenant.model";
import UserModel from "./user.model";

class TopicModel extends Model {
  id: any;
}

TopicModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: TenantModel,
        key: "id",
      },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // user_id: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: UserModel,
    //     key: "id",
    //   },
    // },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: () => Date.now(),
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "topics",
    timestamps: false,
  }
);

export default TopicModel;


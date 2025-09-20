import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import TenantModel from "./tenant.model";
import UserModel from "./user.model";
import TopicModel from "./topic.model";

class OpinionModel extends Model {
  opinion_id!: string;
  tenant_id!: string;
  topic_id!: string;
  debate!: string;
  subject!: object;
  news!: object;
  question!: object;
  reference!: object;
  debate_members!: boolean;
  debate_open_for_all!: boolean;
  likes!: number;
  user_id!: string;
  created_on!: number;
  updated_on!: number;
  created_by!: string;
  updated_by!: string;
}

OpinionModel.init(
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
      onDelete: "CASCADE",
    },
    topic_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TopicModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    debate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    news: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    question: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    reference: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    debate_members: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    debate_open_for_all: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    created_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT.UNSIGNED,
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
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

  },
  {
    sequelize,
    tableName: "opinion",
    timestamps: false,
    underscored: true,
  }
);

// Associations
TenantModel.hasMany(OpinionModel, { foreignKey: "tenant_id", as: "opinion" });
OpinionModel.belongsTo(TenantModel, { foreignKey: "tenant_id", as: "tenant" });

UserModel.hasMany(OpinionModel, { foreignKey: "user_id", as: "opinion" });
OpinionModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });

export default OpinionModel;

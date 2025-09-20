import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";

class NewsModel extends Model {}

NewsModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from_topic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    topic_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "topics", 
        key: "id",
      },
    },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Date.now(),
    },
  },
  {
    sequelize,
    tableName: "news",
    timestamps: false,
  }
);

export default NewsModel;

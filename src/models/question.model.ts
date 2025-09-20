import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/instance";

export interface QuestionAttributes {
  id: string;
  title: string;
  from_topic: any;
  created_by: any;
  topic_id: string;
  created_on: number;
}

export type QuestionCreationAttributes = Optional<QuestionAttributes, "id" | "created_on">;

class QuestionModel extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes {
  public id!: string;
  public title!: string;
  public from_topic!: any;
  public created_by!: any;
  public topic_id!: string;
  public created_on!: number;
}

QuestionModel.init(
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
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    topic_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Date.now(),
    },
  },
  {
    sequelize,
    tableName: "questions",
    timestamps: false,
  }
);

export default QuestionModel;



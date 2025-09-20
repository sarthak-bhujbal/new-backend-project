import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/instance";

interface SubjectAttributes {
  id: string;
  title: string;
  from_topic: any;
  created_by: any;
  topic_id: any;
  created_on: any;
}

type SubjectCreationAttributes = Optional<SubjectAttributes, "id" | "created_on">;

class SubjectModel extends Model<SubjectAttributes, SubjectCreationAttributes>
  implements SubjectAttributes {
  public id!: string;
  public title!: string;
  public from_topic!: string;
  public created_by!: string;
  public topic_id!: string;
  public created_on!: number;
}

SubjectModel.init(
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
    tableName: "subjects",
    modelName: "Subject",
    timestamps: false,
  }
);

export default SubjectModel;
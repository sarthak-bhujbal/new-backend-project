import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/instance";

export interface ReferenceAttributes {
  id: string;
  title: string;
  from_topic: any;
  created_by: any;
  topic_id: string;
  created_on?: number;
}

export interface ReferenceCreationAttributes
  extends Optional<ReferenceAttributes, "id" | "created_on"> {}

class ReferenceModel
  extends Model<ReferenceAttributes, ReferenceCreationAttributes>
  implements ReferenceAttributes
{
  public id!: string;
  public title!: string;
  public from_topic!: any;
  public created_by: any;
  public topic_id!: string;
  public created_on!: number;
}

ReferenceModel.init(
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
      allowNull: false,
    },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Date.now(),
    },
  },
  {
    sequelize,
    tableName: "references",
    modelName: "Reference",
    timestamps: false,
  }
);

export default ReferenceModel;



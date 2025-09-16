import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { convertEmptyStringsToNull } from "../db/hooks/convert_empty_strings_to_null";
import { beforeSave } from "../db/hooks/time_format_hook";
import { Course } from "./course.model";
export class lesson extends Model {
  public id!: string;
  public title!: string;
  public section_id?: string;
  public course_id!: string;
}

lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      references: { model: "courses", key: "id" },
      allowNull: false,
    },
    seq_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    client_id: { type: DataTypes.UUID, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "lessons",
    timestamps: false,
    hooks: {
      beforeValidate: (instance) => {
        convertEmptyStringsToNull(instance);
      },
      beforeSave: (instance) => {
        beforeSave(instance);
      },
    },
  }
);
lesson.belongsTo(Course, { foreignKey: "course_id" });

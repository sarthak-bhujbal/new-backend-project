import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { convertEmptyStringsToNull } from "../db/hooks/convert_empty_strings_to_null";
import { beforeSave } from "../db/hooks/time_format_hook";
import { Course } from "../models/course.model";
import { lesson } from "./lesson.model";
export class Section extends Model {
  public id!: string;
  public title!: string;
  public seq_no?: number;
  public course_id!: string;
  public lesson_id!: string;
  public content_type?: any;
  public quizzes?: any;
}

Section.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    seq_no: {
      type: DataTypes.INTEGER,
    },
    duration: {
      type: DataTypes.STRING(255),
    },
    content_type: {
      type: DataTypes.JSON,
    },
    quizzes: {
      type: DataTypes.JSON,
    },
    course_id: {
      type: DataTypes.UUID,
      references: { model: "courses", key: "id" },
      allowNull: false,
    },
    lesson_id: {
      type: DataTypes.UUID,
      references: { model: "lesson", key: "id" },
      allowNull: false,
    },
    client_id: { type: DataTypes.UUID, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "sections",
    timestamps: false,
    hooks: {
      beforeValidate: (instance) => convertEmptyStringsToNull(instance),
      beforeSave: (instance) => beforeSave(instance),
    },
  }
);

Section.belongsTo(Course, { foreignKey: "id" });
Section.belongsTo(lesson, { foreignKey: "id" });

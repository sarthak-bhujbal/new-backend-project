import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import TopicModel from "./topic.model";

class TenantModel extends Model {
  public id!: string;
  public name!: string | null;
  public cover_photo!: string | null;
  public username!: string | null;
  public password!: string | null;
  public confirm_password!: string | null;
  public mobile!: string | null;
  public email!: string | null;
  public language!: any | null;
  public bio!: string | null;
  public owner_name!: string | null;
  public offices!: object | null;
  public youtube_link!: string | null;
  public telegram_link!: string | null;
  public whatsapp_link!: string | null;
  public website_link!: string | null;
  public instagram_link!: string | null;
  public created_by!: string | null;
  public updated_by!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
}

TenantModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirm_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    language: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offices: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    youtube_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telegram_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsapp_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_link: {
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
    created_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
  },
  {
    sequelize,
    tableName: "tenants",
    timestamps: false,
  }
);

export default TenantModel;

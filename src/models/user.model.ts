import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";
import TenantModel from "./tenant.model";

class UserModel extends Model {
  id!: string;
  tenant_id!: string;
  name!: string;
  user_name!: string;
  password!: string;
  phone_number!: string;
  email!: string;
  language!: string;
  status!: "active" | "inactive" | "locked";
  locked_until!: Date | null;
  login_attempts!: number;
  role!: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    language: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cover_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    otp_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    login_attempts: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
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
  },
  {
    sequelize,
    tableName: "users", // ✅ FIXED (use plural, matches SQL table)
    timestamps: false,
  }
);

export default UserModel;

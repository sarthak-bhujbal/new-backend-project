import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";

class DocumentModel extends Model {
  id!: string;
  agent_id!: string | null;
  customer_id!: string | null;
  file_name!: string;
  file_path!: string;
  file_type!: 'pdf' | 'image';
  created_at!: Date;
  updated_at!: Date;
}

DocumentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.ENUM('pdf', 'image'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "documents",
    timestamps: false, // because we manage created_at / updated_at manually
  }
);

export default DocumentModel;

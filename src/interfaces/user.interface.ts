import { Json } from "sequelize/types/utils";

export default interface UserInterface {
  id?: string;
  name: string;
  user_name: string;
  password: string;
  phone_number: string;
  email: string;
  language: string[];
  cover_photo?: string;
  // audit fields
  created_on?: number;
  updated_on?: number;
  created_by?: string;
  updated_by?: string;
}

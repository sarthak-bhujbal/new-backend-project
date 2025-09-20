import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "../models/user.model";
import UserRepository from "../repositories/user.repo";
import UserInterface from "../interfaces/user.interface";

class UserService {
  private userRepository: any;

  constructor() {
    this.userRepository = UserRepository;
  }

  // Generate JWT Token
  private generateToken(user: any) {
    const payload = {
      id: user.id,
      user_name: user.user_name,
      phone_number: user.phone_number,
      tenant_id: user.tenant_id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "defaultSecretKey", {
      expiresIn: "1h", // 1 hour expiry
    });
  }

  async createUser(data: UserInterface) {
    try {
      // Manual check for username / phone_number
      const existingUser = await UserModel.findOne({
        where: {
          [Op.or]: [
            { user_name: data.user_name },
            { phone_number: data.phone_number },
          ],
        },
      });

      if (existingUser) {
        if (
          existingUser.user_name === data.user_name &&
          existingUser.phone_number === data.phone_number
        ) {
          return {
            status_code: 400,
            message: "Username and phone number already exist",
          };
        } else if (existingUser.user_name === data.user_name) {
          return { status_code: 400, message: "Username already exists" };
        } else if (existingUser.phone_number === data.phone_number) {
          return { status_code: 400, message: "Phone number already exists" };
        }
      }

      // Hash password
      if (data.password) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
      }

      // Create user in DB
      const user = await this.userRepository.createUser(data);

      // Convert Sequelize instance to plain JSON
      const userData = user.toJSON();

      // Generate token
      const token = this.generateToken(userData);

 const filteredUser = {
        id: userData.id,
        name: userData.name,
        user_name: userData.user_name,
        phone_number: userData.phone_number,
        email: userData.email,
        language: userData.language,
        token,
      };
      return {
        status_code: 201,
        message: "User created successfully",
        data: {
          ...filteredUser,
          token,
        },
      };
    } catch (error: any) {
      // Handle unique constraint errors gracefully
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error?.errors?.[0]?.path || "field";
        return {
          status_code: 400,
          message: `${field} must be unique`,
        };
      }

      console.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async getUserById(id: string) {
    return await this.userRepository.getUserById(id);
  }

  async getAllUsers(page: number = 1, limit: number = 10, tenant_id: string) {
    const pageSize = limit;
    const offset = (page - 1) * limit;

    const { rows, count } =
      await this.userRepository.getAllUsers(pageSize, offset, tenant_id);

    return {
      users: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

export default new UserService();

import TenantModel from "../models/tenant.model";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/instance";

class TenantService {
  getAllTenants(arg0: number, arg1: number) {
    throw new Error("Method not implemented.");
  }
  async createTenant(data: any) {
    const t = await sequelize.transaction();

    try {
      const existing = await TenantModel.findOne({
        where: { username: data.username },
      });

      if (existing) {
        await t.rollback();
        return {
          status_code: 400,
          message: "Tenant with this username already exists",
        };
      }

      const tenant = await TenantModel.create(
        {
          name: data.name,
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          language: data.language,
          created_by: data.created_by,
          updated_by: data.updated_by,
        },
        { transaction: t }
      );

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await UserModel.create(
        {
          tenant_id: tenant.id,
          name: data.name,
          user_name: data.username,
          email: data.email,
          password: hashedPassword,
          phone_number: data.mobile,
          role: "tenant_admin", 
          otp_verified: false,
        },
        { transaction: t }
      );

      await t.commit();

      const token = jwt.sign(
        {
          user_id: user.id,
          tenant_id: tenant.id,
          role: user.role,
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
      );

      return {
        status_code: 201,
        message: "Tenant & User created successfully",
        data: {
          tenant_id: tenant.id,
          user_id: user.id,
          token, 
        },
      };
    } catch (error: any) {
      await t.rollback();
      return {
        status_code: 500,
        message: "Internal server error",
        error: error.message,
      };
    }
  }
}

export default TenantService;

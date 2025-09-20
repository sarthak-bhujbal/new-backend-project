import UserModel from "../models/user.model";
import TenantModel from "../models/tenant.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config(); 

export const createDefaultSuperAdmin = async () => {
  try {
    // 1️⃣ Ensure a tenant exists
    let tenant = await TenantModel.findOne({ where: { name: "Default Tenant" } });
    if (!tenant) {
      tenant = await TenantModel.create({
        id: uuidv4(),
        name: "Default Tenant",
        display_name: "Default Tenant",
      });
    }

    // 2️⃣ Check if Super Admin already exists
    const existingSuperAdmin = await UserModel.findOne({
      where: { role: "SUPER_ADMIN" },
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists:", existingSuperAdmin.email);
      return;
    }

    // 3️⃣ Hash password
    const plainPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin123!";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 4️⃣ Create Super Admin with tenant_id
    const superAdmin = await UserModel.create({
      id: uuidv4(),
      tenant_id: tenant.id,       // ✅ Mandatory
      first_name: "Super",
      last_name: "Admin",
      email: process.env.SUPER_ADMIN_EMAIL || "superadmin@opinion.com",
      phone_number: process.env.SUPER_ADMIN_PHONE || "+1234567890",
      password: hashedPassword,
      status: "active",
      role: "SUPER_ADMIN",        // ✅ Ensure your column type is STRING
      created_on: Date.now(),
      updated_on: Date.now(),
    });

    // 5️⃣ Generate JWT
    const token = generateJwt(superAdmin);

    console.log("Default Super Admin created successfully:", superAdmin.email);
    console.log("Super Admin JWT:", token); 

  } catch (error) {
    console.error("Error creating default Super Admin:", error);
  }
};

const generateJwt = (user: any) => {
  return jwt.sign(
    {
      user_id: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || "your-secret-key-here"
  );
};

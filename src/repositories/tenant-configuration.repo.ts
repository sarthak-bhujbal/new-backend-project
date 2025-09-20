import ClientConfiguration from "../models/tenant-configuration.model";
import { Transaction } from "sequelize";

export class ConfigurationRepository {
  async findExistingConfiguration(
    tenant_id: string,
    type: string,
    sub_type?: string | null,
    location_id?: string | null,
    department_id?: string | null,
    trx?: Transaction
  ) {
    return await ClientConfiguration.findOne({
      where: {
        tenant_id,
        type,
        sub_type: sub_type ?? null,
        location_id: location_id ?? null,
        department_id: department_id ?? null,
      },
      transaction: trx,
    });
  }

  async createConfiguration(
    data: {
      type: string;
      sub_type?: string | null;
      value: string;
      tenant_id: string;
      created_by: string;
      updated_by: string;
      location_id?: string | null;
      department_id?: string | null;
    },
    trx?: Transaction
  ) {
    return await ClientConfiguration.create(
      {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: trx }
    );
  }
}

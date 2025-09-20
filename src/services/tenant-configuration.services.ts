import { TenantConfiguration } from "../interfaces/tenant-configuration.interface.interface";
import logger from "../plugins/logger-plugins";
import { getSequelize } from "../plugins/sequelize-plugin";
import { ConfigurationRepository } from "../repositories/tenant-configuration.repo";

export class ConfigurationService {
  private repo: ConfigurationRepository;

  constructor() {
    this.repo = new ConfigurationRepository();
  }

  async createConfiguration({
    data,
    tenant_id,
    created_by,
    updated_by,
  }: {
    data: TenantConfiguration;
    tenant_id: string;
    created_by: string;
    updated_by: string;
  }) {
    logger.info({ tenant_id, created_by }, "Creating new configurations");
    const trx = await getSequelize().transaction();

    try {
      const existing = await this.repo.findExistingConfiguration(
        tenant_id,
        data.type,
        data.sub_type ?? null,
        data.location_id ?? null,
        data.department_id ?? null,
        trx
      );

      if (existing) {
        await trx.rollback();
        return {
          success: false,
          message: `This configuration type and sub-type already exist for the client.`,
        };
      }

      const config = await this.repo.createConfiguration(
        {
          type: data.type || "",
          sub_type: data.sub_type || null,
          value: data.value,
          tenant_id,
          created_by,
          updated_by,
          location_id: data.location_id || null,
          department_id: data.department_id || null,
        },
        trx
      );

      await trx.commit();

      return {
        success: true,
        message: "Configurations created successfully.",
        configurations: config,
      };
    } catch (error) {
      await trx.rollback();
      logger.error({ tenant_id, error }, "Error creating configurations");
      throw error;
    }
  }
}
export default new ConfigurationService();
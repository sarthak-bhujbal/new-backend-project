import { FastifyRequest, FastifyReply } from 'fastify';
import ConfigurationService from '../services/tenant-configuration.services';
import { TenantConfiguration } from '../interfaces/tenant-configuration.interface.interface';
import logger from '../plugins/logger-plugins';

class TenantConfigurationController {
  createConfiguration = async (
    request: FastifyRequest<{ Params: { tenant_id: string }; Body: TenantConfiguration }>,
    reply: FastifyReply
  )=> {
    try {
      const { tenant_id } = request.params;
      const user_id = (request.user as { user_id: string }).user_id;

      const response = await ConfigurationService.createConfiguration({
        data: request.body,
        tenant_id,
        created_by: user_id,
        updated_by: user_id,
      });

      if (!response.success) {
        return reply.status(400).send({ message: response.message });
      }

      logger.info({ tenant_id, user_id }, 'Configuration created successfully');
      return reply.code(201).send(response);
    } catch (error: any) {
      logger.error({ error }, 'Error creating configuration');
      return reply
        .code(500)
        .send({ message: 'Error creating configuration', error: error.message });
    }
  }
}

const tenantConfigurationController = new TenantConfigurationController();
export default tenantConfigurationController;

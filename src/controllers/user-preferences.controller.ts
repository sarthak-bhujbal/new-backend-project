import { FastifyRequest, FastifyReply } from 'fastify';
import Service from '../services/user-preferences.service';
import { UserPreferences } from '../interfaces/user-preferences.interface';

class UserPreferencesController {
  // CREATE
  createPreference = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = request.body as UserPreferences;

      // Call the service to create the preference directly
      const result = await Service.createPreference(data);

      return reply.code(result.status_code).send({
        message: result.message,
        data: result.data || null,
      });
    } catch (error: any) {
      return reply.code(500).send({
        message: error.message || 'Internal server error',
        data: null,
      });
    }
  };
}

export default new UserPreferencesController();

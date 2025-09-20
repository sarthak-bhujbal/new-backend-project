import { FastifyRequest, FastifyReply } from 'fastify';
import roleService from '../services/role.service';
import { CreateRoleRequest } from '../interfaces/role.interface';

class RoleController {
  private response: any;

  constructor() {
    this.response = {
      status_code: 200,
      message: null,
      error: null,
      data: null,
      sendResponse(reply: FastifyReply) {
        return reply.code(this.status_code).send({
          message: this.message,
          error: this.error,
          data: this.data,
        });
      }
    };
  }

  /**
   * Create Role
   * Expects tenant_id in query or from logged-in user's token
   */
  createRole = async (
    request: FastifyRequest<{ Params: { tenant_id?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const roleData = request.body as CreateRoleRequest;
      const user_id = (request as any).user?.user_id;
      const { tenant_id } = request.params;

      if (!tenant_id) {
        this.response.status_code = 400;
        this.response.message = "Missing tenant_id";
        return this.response.sendResponse(reply);
      }

      const result = await roleService.createRole({
        ...roleData,
        tenant_id,
        created_by: user_id,
        updated_by: user_id,
      });

      if (!result.success || !result.role) {
        this.response.status_code = 400;
        this.response.message = result.message;
        this.response.data = null;
      } else {
        this.response.status_code = 201;
        this.response.data = { role_id: result.role.id };
        this.response.message = "Role created successfully";
      }
    } catch (error: any) {
      request.log.error(error);
      this.response.status_code = 500;
      this.response.message = 'Internal server error';
      this.response.error = error.message || error;
      this.response.data = null;
    }
    return this.response.sendResponse(reply);
  };
}

export default new RoleController();

import { FastifyRequest, FastifyReply } from "fastify";
import TenantService from "../services/tenant.service";

class TenantController {
  private tenantService: TenantService;
  private service: TenantService;

  constructor() {
    this.tenantService = new TenantService();
    this.service = new TenantService();
  }

  createTenant = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
       try {
      const tenantData = request.body as any;
      const result = await this.tenantService.createTenant(tenantData);
      return reply.code(result.status_code).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Internal server error" });
    }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Internal server error" });
    }
   
  };

  getAllTenants = async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = 1, limit = 10 } = request.query as any;
    const response = await this.service.getAllTenants(Number(page), Number(limit));
    return reply.code(200).send(response);
  };
}

export default new TenantController();
const tenantController = new TenantController();


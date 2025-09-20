import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/user.service";
import UserInterface from "../interfaces/user.interface";

class UserController {
  private service: typeof UserService;

  constructor() {
    this.service = UserService;
  }

  // POST API - Create User
  createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // const {tenant_id} = request.params as {tenant_id: string}
      const body = request.body as UserInterface;
      const user = await this.service.createUser(body);

      if (user.status_code && user.status_code !== 200) {
        return reply.status(user.status_code).send(user);
      }

        return reply.status(201).send({
          status_code: 201,
          message: "User created successfully",
          data: user,
        });
    } catch (error: any) {
      return reply.status(500).send({
        status_code: 500,
        message: "Error creating user",
        error: error.message,
      });
    }
  }

  getUserById = async (request: FastifyRequest, reply: FastifyReply) => {

    const { id } = request.params as { id: string }

    if (!id) {
      return reply.status(400).send({
        status_code: 400,
        message: "The id is Missing",
      });
    }
    try {
      const user = await this.service.getUserById(id);

      if (!user) {
        return reply.status(200).send({
          status_code: 200,
          message: "User not found",
          data: []
        });
      }

      return reply.status(200).send({
        status_code: 200,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error: any) {
      return reply.status(500).send({
        status_code: 500,
        message: "Error fetching user",
        error: error.message,
      });
    }
  }

  getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = "1", limit = "10" } = request.query as {
      page?: string;
      limit?: string;
    };

    const {tenant_id} = request.params as {tenant_id: string};

    if (!tenant_id) {
      return reply.status(400).send({
        status_code: 400,
        message: "The tenant_id is Missing",
      });
    }
    const result = await this.service.getAllUsers(Number(page), Number(limit),tenant_id);

    return reply.status(200).send({
      status_code: 200,
      message: "Users fetched successfully",
      pagination: {
        count: result.total,
         totalPages: result.totalPages,
        page: result.page,
        limits: result.limit,
      },
       data: result.users,
    });
  }
}

export default new UserController();

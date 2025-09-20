import { FastifyReply, FastifyRequest } from "fastify";
import { CreatedPermission, UpdatePermissionInterface } from "../interfaces/permission.interface";
import PermissionService from "../services/permission.service";
import { getPagination } from "../utilities/pagination.util";

class PermissionController {
    private service: any;

    constructor() {
        this.service = new PermissionService();
    }

    createPermission =async (request: FastifyRequest, reply: FastifyReply)=> {
        try {
            const permissionData = request.body as CreatedPermission;

            const permission = await this.service.createPermission({
                ...permissionData,
            });

            return reply.code(201).send({
                success: true,
                message: 'Permission created successfully',
                permission: {
                    id: permission.id,
                },
            });
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new PermissionController();
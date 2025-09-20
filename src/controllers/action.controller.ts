import { FastifyReply, FastifyRequest } from "fastify";
import { CreateActionRequest } from "../interfaces/action interface";
import ActionService from "../services/action.services";

class ActionController {
    service: any;

    constructor() {
        this.service = new ActionService();
    }

    createAction = async (request: FastifyRequest, reply: FastifyReply)=> {
        try {
            const actionData = request.body as CreateActionRequest;
            const result = await this.service.createAction(actionData);

            if (!result.success) {
                return reply.code(400).send({ message: result.message });
            }

            return reply.code(201).send({
                success: true,
                message: 'Action created successfully',
                action: result.action
            });
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Internal server error' });
        }
    }

}

export default new ActionController();
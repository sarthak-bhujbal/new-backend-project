import { FastifyReply, FastifyRequest } from "fastify";
import OpinionService from "../services/opinion.service";
import OpinionInterface from "../interfaces/opinion.interface";

const service = new OpinionService();

export default class OpinionController {
    async createOpinion(
        request: FastifyRequest<{ Params: { tenant_id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const body = request.body as OpinionInterface;
            const { tenant_id } = request.params;

            if (!tenant_id) {
                return reply.status(400).send({
                    status_code: 400,
                    message: "Missing tenant_id",
                });
            }

            //Attach tenant_id from params into body
            const opinionData = {
                ...body,
                tenant_id,
            };

            const opinion = await service.createOpinion(opinionData);

            reply.code(201).send(opinion);
        } catch (error: any) {
            reply
                .code(500)
                .send({ message: "Error creating opinion", error: error.message });
        }
    }


    async getOpinion(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const opinion = await service.getOpinionById(id);
            if (!opinion) return reply.code(404).send({ message: "Opinion not found" });
            reply.send(opinion);
        } catch (error: any) {
            reply.code(500).send({ message: "Error fetching opinion", error: error.message });
        }
    }

    async getAllOpinion(request: FastifyRequest, reply: FastifyReply) {
        try {
            const opinions = await service.getAllOpinions();
            reply.send(opinions);
        } catch (error: any) {
            reply.code(500).send({ message: "Error fetching opinions", error: error.message });
        }
    }

    async updateOpinion(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const body = request.body as Partial<OpinionInterface>;
            const updated = await service.updateOpinion(id, body);
            if (!updated) return reply.code(404).send({ message: "Opinion not found" });
            reply.send(updated);
        } catch (error: any) {
            reply.code(500).send({ message: "Error updating opinion", error: error.message });
        }
    }

    async deleteOpinion(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await service.deleteOpinion(id);
            if (!deleted) return reply.code(404).send({ message: "Opinion not found" });
            reply.send({ message: "Opinion deleted successfully" });
        } catch (error: any) {
            reply.code(500).send({ message: "Error deleting opinion", error: error.message });
        }
    }
}

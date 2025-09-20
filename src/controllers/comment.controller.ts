import { FastifyReply, FastifyRequest } from 'fastify';
import CommentService from '../services/comment.service';
import CommentInterface from '../interfaces/comment.interface';

const service = new CommentService();

export default class CommentController {
  async createComment(
    request: FastifyRequest<{ Params: { tenant_id: string }, Body: CommentInterface }>,
    reply: FastifyReply
  ) {
    try {
      const { tenant_id } = request.params;
      const body = request.body as CommentInterface;

      if (!tenant_id) {
        return reply.status(400).send({
          status_code: 400,
          message: "Missing tenant_id",
        });
      }

      // Attach tenant_id into body
      const commentData = {
        ...body,
        tenant_id,
      };

      const comment = await service.createComment(commentData);

      return reply.code(201).send(comment);
    } catch (error: any) {
      return reply
        .code(500)
        .send({ message: "Error creating comment", error: error.message });
    }
  }


  async getAllComments(req: FastifyRequest, reply: FastifyReply) {
    const comments = await service.getAllComments();
    return reply.send(comments);
  }

  async getCommentById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const comment = await service.getCommentById(req.params.id);
    return comment ? reply.send(comment) : reply.code(404).send({ message: 'Comment not found' });
  }

  async updateComment(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<CommentInterface> }>,
    reply: FastifyReply
  ) {
    const comment = await service.updateComment(req.params.id, req.body);
    return reply.send(comment);
  }

  async deleteComment(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const deleted = await service.deleteComment(req.params.id);

      if (deleted[0] === 0) {
        // No rows updated
        return reply.code(404).send({ message: "Comment not found or already deleted" });
      }

      return reply.code(200).send({
        message: "Comment deleted successfully",
        comment_id: req.params.id,
      });
    } catch (error: any) {
      return reply
        .code(500)
        .send({ message: "Failed to delete comment", error: error.message });
    }
  }
}

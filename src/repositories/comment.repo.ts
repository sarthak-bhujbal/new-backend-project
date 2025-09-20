import CommentModel from '../models/comment.model';
import CommentInterface from '../interfaces/comment.interface';
import { DATE } from 'sequelize';

export default class CommentRepository {
    async createComment(data: CommentInterface) {
        return await CommentModel.create(data as any);
    }

    async getAllComments() {
        return await CommentModel.findAll({where: {is_deleted: false}});
    }

    async getCommentById(id: string) {
        return await CommentModel.findByPk(id);
    }

    async updateComment(id: string, data: Partial<CommentInterface>) {
        await CommentModel.update(data, { where: {  id } });
        return await CommentModel.findByPk(id);
    }

    async deleteComment(id: string) {
        return await CommentModel.update(
            { is_deleted: true, updated_on: Date.now() },
            { where: {id} });
    }
}

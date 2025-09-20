import  CommentRepository from '../repositories/comment.repo';
import  CommentInterface  from '../interfaces/comment.interface';

export default class CommentService {
  private repo = new CommentRepository();

  async createComment(data: CommentInterface) {
    return this.repo.createComment(data);
  }

  async getAllComments() {
    return this.repo.getAllComments();
  }

  async getCommentById(id: string) {
    return this.repo.getCommentById(id);
  }

  async updateComment(id: string, data: Partial<CommentInterface>) {
    return this.repo.updateComment(id, data);
  }

  async deleteComment(id: string) {
    return this.repo.deleteComment(id);
  }
}

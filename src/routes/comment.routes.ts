import  CommentController  from '../controllers/comment.controller';

const commentController = new CommentController();

export const commentRoutes = [
  {
    method: 'POST',
    url: '/:tenant_id/comments',
    handler: commentController.createComment,
  },
  {
    method: 'GET',
    url: '/comments',
    handler: commentController.getAllComments,
  },
  {
    method: 'GET',
    url: '/comments/:id',
    handler: commentController.getCommentById,
  },
  {
    method: 'PUT',
    url: '/comments/:id',
    handler: commentController.updateComment,
  },
  {
    method: 'DELETE',
    url: '/comments/:id',
    handler: commentController.deleteComment,
  },
];

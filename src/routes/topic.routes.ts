import topicController from "../controllers/topic.controller";
//import { decodeToken } from "../middleware/verify-token";
 

const topicRoutes = [
  {
    method: "POST",
    url: "/topic/create",
   // preHandler: decodeToken,
    handler: topicController.create,
  },
  {
    method: "GET",
    url: "/topics",
   // preHandler: decodeToken,
    handler: topicController.getAlltopics,
  },
  {
    method: "GET",
    url: "/topic/:id",
    //preHandler: decodeToken,
    handler: topicController.getById,
  },
  {
    method: "PUT",
    url: "/topic/update/:id",
    //preHandler: decodeToken,
    handler: topicController.update,
  },
  {
    method: "GET",
    url: "/getAll/trending/topics",
    //preHandler: decodeToken,
    handler: topicController.getAllTrendingTopics,
  },
  {
    method: "GET",
    url: "/news/user/:user_id/topic/:topic_id",
    handler: topicController.getAllNewsbyTopicId,
  },
    {
    method: "GET",
    url: "/subject/user/:user_id/topic/:topic_id",
    handler: topicController.getAllSubjectsbyTopicId,
  },
    {
    method: "GET",
    url: "/question/user/:user_id/topic/:topic_id",
    handler: topicController.getAllQuestionsbyTopicId,
  },
    {
    method: "GET",
    url: "/reference/user/:user_id/topic/:topic_id",
    handler: topicController.getAllReferncesbyTopicId,
  },
  {
    method: "DELETE",
    url: "/topic/delete/:id",
  //  preHandler: decodeToken,
    handler: topicController.delete,
  },
];

export default topicRoutes;

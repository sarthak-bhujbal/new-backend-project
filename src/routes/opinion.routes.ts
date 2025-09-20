import  OpinionController  from '../controllers/opinion.controller';

const opinionController = new OpinionController();

const  opinionRoutes = [
  {
    method: 'POST',
    url: '/:tenant_id/opinions',
    handler: opinionController.createOpinion,
  },
  {
    method: 'GET',
    url: '/opinions',
    handler: opinionController.getAllOpinion,
  },
  {
    method: 'GET',
    url: '/opinions/:id',
    handler: opinionController.getOpinion,
  },
  {
    method: 'PUT',
    url: '/opinions/:id',
    handler: opinionController.updateOpinion,
  },
  {
    method: 'DELETE',
    url: '/opinions/:id',
    handler: opinionController.deleteOpinion,
  },
];
export default opinionRoutes;
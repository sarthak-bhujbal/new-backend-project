import actionController from "../controllers/action.controller";

const actionRoutes = [
    {
          method: 'POST',
          url: '/action/create',
          // preHandler: decodeToken,
          handler: actionController.createAction,
      },
]

export default actionRoutes;
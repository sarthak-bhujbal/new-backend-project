import roleController from "../controllers/role.controller";

const roleRoutes = [
  {
        method: 'POST',
        url: '/tenant/:tenant_id/role',
        // preHandler: decodeToken,
        handler: roleController.createRole,
    },
]

export default roleRoutes;
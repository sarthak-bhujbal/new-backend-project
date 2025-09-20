import permissionController from "../controllers/permission.controller"; 

const permissionRoutes = [
    {
            method: 'POST',
            url: '/permission/create',
            // preHandler: decodeToken,
            handler: permissionController.createPermission,
        }
]

export default permissionRoutes;
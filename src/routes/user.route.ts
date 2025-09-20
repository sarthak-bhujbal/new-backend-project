import { decodeToken } from "../middleware/verify-token";
import userController from "../controllers/user.controller";

const userRoutes = [
  {
        method: 'POST',
        url: '/user',
        handler: userController.createUser,
    },
{
  method: 'GET',
  url: '/tenant/:tenant_id/user/:id',
  handler: userController.getUserById,
},
{
  method: 'GET',
  url: '/tenant/:tenant_id/users',
  handler: userController.getAllUsers,
},
]

export default userRoutes;

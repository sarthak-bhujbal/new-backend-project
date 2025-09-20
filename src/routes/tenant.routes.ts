import tenantController from "../controllers/tenant.controller";
import { decodeToken } from "../middleware/verify-token";

const tenantRoutes = [
  {
        method: 'POST',
        url: '/tenant/create',
        handler: tenantController.createTenant,
    },
]
export default tenantRoutes;
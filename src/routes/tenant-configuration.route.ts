import tenantConfigurationController from "../controllers/tenant-configuration.controller";

const tenantConfigurationRoutes = [
  {
        method: 'POST',
        url: '/tenant/configuration/create',
        // preHandler: decodeToken,
        handler: tenantConfigurationController.createConfiguration,
    },
]
export default tenantConfigurationRoutes;
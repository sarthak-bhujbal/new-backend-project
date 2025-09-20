import actionRoutes from "./action.routes";
import authRoutes from "./auth.routes";
import permissionRoutes from "./permission.routes";
import roleRoutes from "./role.route";
import tenantConfigurationRoutes from "./tenant-configuration.route";
import tenantRoutes from "./tenant.routes";
import topicRoutes from "./topic.routes";
import userPreferencesRoutes from "./user-preferences.route";
import userRoutes from "./user.route";
import opinionRoutes from "./opinion.routes";
import { commentRoutes } from "./comment.routes";

let routes: any = [];

actionRoutes.forEach((route: any) => {
    routes.push(route);
});

authRoutes.forEach((route: any) => {
    routes.push(route);
});

permissionRoutes.forEach((route: any) => {
    routes.push(route);
});

roleRoutes.forEach((route: any)=> {
  routes.push(route);
})

tenantConfigurationRoutes.forEach((route: any)=> {
  routes.push(route);
})

tenantRoutes.forEach((route: any)=> {
  routes.push(route);
})

userPreferencesRoutes.forEach((route: any)=> {
  routes.push(route);
})

userRoutes.forEach((route: any)=>{
  routes.push(route);
})

topicRoutes.forEach((route:any)=>{
  routes.push(route);
})

opinionRoutes.forEach((route: any) => {
  routes.push (route);
})
commentRoutes.forEach((route: any)=>{
  routes.push(route);
})
export default routes;

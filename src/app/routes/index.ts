import { Router } from "express";
import { CategoryRoute } from "../module/category/category.route";


type ModuleRoute = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/categories",
    route: CategoryRoute,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const globalRoutes = router;

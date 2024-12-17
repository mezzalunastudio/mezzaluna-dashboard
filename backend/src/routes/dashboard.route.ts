import { Router } from "express";
import { menuTreeHandler, menuByRoleHandler, addMenuItemHandler } from "../controllers/dashboard.controller";

const dashboardRoutes = Router();

// prefix: /dashboard
dashboardRoutes.get("/menu", menuTreeHandler);
dashboardRoutes.get("/menu/role", menuByRoleHandler);
dashboardRoutes.post("/menu", addMenuItemHandler)

export default dashboardRoutes;

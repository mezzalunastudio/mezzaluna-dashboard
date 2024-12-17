import { Router } from "express";
import { getUserHandler, addUserRoleHandler } from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", getUserHandler);
userRoutes.post("/role",addUserRoleHandler);
export default userRoutes;

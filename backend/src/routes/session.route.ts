import { Router } from "express";
import {
  deleteAllSessionHandler,
  deleteSessionHandler,
  getSessionsHandler,
} from "../controllers/session.controller";

const sessionRoutes = Router();

// prefix: /sessions
sessionRoutes.get("/", getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);
sessionRoutes.delete("/all/:code", deleteAllSessionHandler);

export default sessionRoutes;

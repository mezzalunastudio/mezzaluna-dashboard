import { Router } from "express";
import { getWeddingContentByCategoryHandler, saveRspvHandler } from "../controllers/content.controller";

const contentRoutes = Router();

// prefix: /content
contentRoutes.get("/wedding-invitation/:category/:path", getWeddingContentByCategoryHandler);
contentRoutes.post("/:id/rsvp", saveRspvHandler);

export default contentRoutes;

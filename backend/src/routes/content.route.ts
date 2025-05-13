import { Router } from "express";
import { getWeddingContentByCategoryHandler, SaveWeddingHandler, SaveRspvDemoHandler, getRsvpDemoByTemplate, deleteRsvpDemoHandler } from "../controllers/content.controller";

const contentRoutes = Router();

// prefix: /content
contentRoutes.get("/wedding-invitation/:category/:path", getWeddingContentByCategoryHandler);
// contentRoutes.get("rsvo/:weddingId",getRsvpByIdHandler);
// contentRoutes.post("/rsvp/:weddingId", saveRspvHandler);
contentRoutes.get("/demo/rsvp/:template",getRsvpDemoByTemplate);
contentRoutes.post("/demo/rsvp/",SaveRspvDemoHandler);
contentRoutes.delete("/demo/rsvp/:id",deleteRsvpDemoHandler);
contentRoutes.post("/",SaveWeddingHandler);

export default contentRoutes;

import { Router } from "express";
import { getWeddingContentByCategoryHandler, SaveWeddingHandler, SaveRspvDemoHandler, getRsvpDemoByTemplate, deleteRsvpDemoHandler, getRsvpByIdHandler, saveRspvHandler, deleteRsvpHandler } from "../controllers/content.controller";

const contentRoutes = Router();

// prefix: /content
contentRoutes.get("/wedding-invitation/:category/:path", getWeddingContentByCategoryHandler);
contentRoutes.get("/rsvp/:weddingId",getRsvpByIdHandler);
contentRoutes.post("/rsvp/:weddingId", saveRspvHandler);
contentRoutes.delete("/rsvp/:id",deleteRsvpHandler);
contentRoutes.get("/demo/rsvp/:template",getRsvpDemoByTemplate);
contentRoutes.post("/demo/rsvp/",SaveRspvDemoHandler);
contentRoutes.delete("/demo/rsvp/:id",deleteRsvpDemoHandler);
contentRoutes.post("/",SaveWeddingHandler);

export default contentRoutes;

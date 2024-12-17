import { Router } from "express";
import { launchWeddingHandler,getWeddingHandler, addWeddingHandler, updateWeddingHandler, deleteWeddingHandler, getByIdWeddingHandler , getByCategoryHandler } from "../controllers/wedding.controller";

const weddingRoutes = Router();

// prefix: /wedding
weddingRoutes.get("/", getWeddingHandler);
weddingRoutes.post("/",addWeddingHandler);
weddingRoutes.patch("/:id",updateWeddingHandler);
weddingRoutes.delete("/:id",deleteWeddingHandler);
weddingRoutes.get("/item/:id",getByIdWeddingHandler);
weddingRoutes.post("/launch/:id",launchWeddingHandler);
weddingRoutes.get("/:category", getByCategoryHandler);
export default weddingRoutes;

import { Router } from "express";
import { upload, uploadImage, getImageFile, deleteImage } from "../controllers/image.controller";

const imageRouter = Router();

imageRouter.post("/:category/:pathname/", upload.single("file"), uploadImage);
imageRouter.get("/:key", getImageFile);
imageRouter.delete("/:key", deleteImage);

export default imageRouter;
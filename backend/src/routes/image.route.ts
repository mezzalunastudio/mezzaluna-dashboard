import { Router } from "express";
import { upload, uploadImage, getImageFile, deleteImage } from "../controllers/image.controller";

const imageRouter = Router();

imageRouter.post("/:category/:pathname/", upload.single("file"), uploadImage);
imageRouter.get("/:category/:pathname/:imgname", getImageFile);
imageRouter.delete("/:category/:pathname/:imgname", deleteImage);

export default imageRouter;
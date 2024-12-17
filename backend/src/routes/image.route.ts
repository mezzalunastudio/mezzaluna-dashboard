import { Router } from "express";
import { upload, uploadImage, getImageFile } from "../controllers/image.controller";

const imageRouter = Router();

// Route untuk upload gambar
imageRouter.post("/:category/:pathname", upload.single("file"), uploadImage);

// Route untuk mendapatkan gambar berdasarkan nama file
imageRouter.get("/:category/:pathname/:filename", getImageFile);

export default imageRouter;

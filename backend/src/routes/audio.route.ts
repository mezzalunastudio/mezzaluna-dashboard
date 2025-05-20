import { Router } from "express";
import { cutAndUploadAudio, upload } from "../controllers/file.controller";

const audioRouter = Router();

audioRouter.post("/:category/:pathname/", upload.single("file"), cutAndUploadAudio);

export default audioRouter;
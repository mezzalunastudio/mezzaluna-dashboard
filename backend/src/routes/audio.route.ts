import { Router } from "express";
import { cutAndUploadAudio, getAudioUrls, upload } from "../controllers/file.controller";

const audioRouter = Router();

audioRouter.post("/:category/:pathname/", upload.single("file"), cutAndUploadAudio);
audioRouter.post("/url", getAudioUrls);

export default audioRouter;
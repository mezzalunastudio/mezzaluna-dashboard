import { Request, Response } from "express";
import multer from "multer";
import { s3Client, generateFileKey, getPresignedUrl } from '../utils/s3.config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_NAME} from "../constants/env";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import ffmpegStatic from 'ffmpeg-static';


const upload = multer({ storage: multer.memoryStorage() });

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const Key = generateFileKey(req,req.file, "images");
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    });

    await s3Client.send(command);
    
    res.status(200).json({
      message: "File uploaded successfully to s3",
      key: Key,
      url: await getPresignedUrl(Key)
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

//test redirect url if server in api.veslavia.com
const getImageFile = async (req: Request, res: Response): Promise<void> => {
 
  try {
    const { category, pathname,imgname } = req.params;
     if (!category || !pathname || !imgname) {
  res.status(400).json({ error: "Invalid parameters" });
  return;
}
    const Key = `${category}/${pathname}/${imgname}`
    const url = await getPresignedUrl(Key);
    res.status(200).json({
        message: "File loaded successfully from s3",
        url: url
      });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, pathname,imgname } = req.params;
    const Key = `${category}/${pathname}/${imgname}`
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME!,
      Key,
    });

    await s3Client.send(command);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

const getBatchImageUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keys } = req.body; // List key gambar
    if (!keys || !Array.isArray(keys)) {
      res.status(400).json({ error: "Keys parameter is missing or invalid" });
      return;
    }

    // Generate URL untuk setiap key
    const urls = await Promise.all(
      keys.map(async (key) => ({
        key,
        url: await getPresignedUrl(key),
      }))
    );

    res.status(200).json({ urls });
  } catch (err) {
    console.error("Error generating batch pre-signed URLs:", err);
    res.status(500).json({ error: "Failed to generate batch pre-signed URLs" });
  }
};

 const cutAndUploadAudio = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { startTime = 0, duration = 60, category, path: pathname } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    // Validate inputs
    const start = parseFloat(startTime);
    const dur = parseFloat(duration);
    if (isNaN(start) || isNaN(dur)) {
      return res.status(400).json({ error: "Invalid timestamp parameters" });
    }

    // Use Vercel's /tmp directory
    const tempDir = "/tmp";
    const tempInputPath = path.join(tempDir, file.originalname);
    const tempOutputPath = path.join(tempDir, `cut-${Date.now()}-${file.originalname}`);

    // Save uploaded audio to a temporary file
    fs.writeFileSync(tempInputPath, file.buffer);

    ffmpeg.setFfmpegPath(ffmpegStatic!);

    // Use FFmpeg to cut the audio
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .setStartTime(start)
        .setDuration(dur)
        .output(tempOutputPath)
        .on("end", () => {
          console.log(`Audio cut successfully from ${start}s for ${dur}s`);
          resolve(true);
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .run();
    });

    // Upload the cut audio to S3
    const audioBuffer = fs.readFileSync(tempOutputPath);
    const Key = generateFileKey(req, file, "audio");

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key,
      Body: audioBuffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // Clean up temporary files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    res.status(200).json({
      message: "Audio processed and uploaded successfully",
      key: Key,
      url: await getPresignedUrl(Key),
      duration: dur,
      startTime: start,
    });
  } catch (err) {
    console.error("Error processing audio:", err);
    res.status(500).json({
      error: "Failed to process and upload audio",
      details: err instanceof Error ? err.message : String(err),
    });
  }
};


const getAudioUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.body; 
    if (!key) {
      res.status(400).json({ error: "Keys parameter is missing or invalid" });
      return;
    }

    const url = await getPresignedUrl(key);

    res.status(200).json({url});
  } catch (err) {
    console.error("Error generating pre-signed URL:", err);
    res.status(500).json({ error: "Failed to generate pre-signed URL" });
  }
};
export { upload, uploadImage, getImageFile, deleteImage, getBatchImageUrls , cutAndUploadAudio, getAudioUrls};
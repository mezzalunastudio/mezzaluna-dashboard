import { Request, Response } from "express";
import multer from "multer";
import { s3Client, generateFileKey, getPresignedUrl } from '../utils/s3.config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_NAME} from "../constants/env";

const upload = multer({ storage: multer.memoryStorage() });

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const Key = generateFileKey(req,req.file);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'private',
    });

    await s3Client.send(command);
    console.log("key:"+Key);
    
    res.status(200).json({
      message: "File uploaded successfully",
      key: Key,
      url: await getPresignedUrl(Key)
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const getImageFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const url = await getPresignedUrl(key);
    res.redirect(url);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

export { upload, uploadImage, getImageFile, deleteImage };
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { S3_BUCKET_NAME,AWS_REGION,AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } from "../constants/env";

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

const generateFileKey = (req: Request, file: Express.Multer.File): string => {
  const { category, pathname } = req.params;
  const extension = file.originalname.split('.').pop();
  return `${category}/${pathname}/${uuidv4()}.${extension}`;
};

const getPresignedUrl = async (Key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME!,
    Key,
  });
  
  try {
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    throw new Error('Failed to generate download URL');
  }
};

export { s3Client, generateFileKey, getPresignedUrl };
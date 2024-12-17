import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { category, pathname } = req.params;
        const targetPath = path.join(__dirname, `../../public/images/${category}/${pathname}`);

        try {
            fs.mkdirSync(targetPath, { recursive: true });
            cb(null, targetPath);
        } catch (err) {
            cb(new Error("Failed to create directory"), "");
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

const uploadImage = (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    res.status(200).json({
        message: "File uploaded successfully",
    });
};

// Controller untuk mengambil file gambar
const getImageFile = (req: Request, res: Response): void => {
    console.log("image");
    const { category } = req.params;
    const { pathname } = req.params;
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "../../public/images",category, pathname,filename);
    if (!fs.existsSync(imagePath)) {
        res.status(404).json({ error: "File not found" });
        return;
    }

    // Kirim file gambar
    res.sendFile(imagePath);
};

export { upload, uploadImage, getImageFile };

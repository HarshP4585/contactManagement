import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'photos/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename: timestamp-randomstring.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'contact-' + uniqueSuffix + ext);
  },
});

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG image files are allowed'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

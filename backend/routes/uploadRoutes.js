import express from 'express';
import multer from 'multer';
import imagekit from '../config/imagekit.js';
import path from 'path';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;

    const response = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: uniqueFileName,
      folder: 'devmentor/users_photo',
    });

    return res.status(200).json({
      message: 'Image uploaded successfully',
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return res.status(500).json({ message: 'Failed to upload image', error: error.message || error });
  }
});

export default router;

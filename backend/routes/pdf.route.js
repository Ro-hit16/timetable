import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { handlePdfUpload } from '../controllers/pdfController.js';

const router = express.Router();
router.post('/upload', upload.single('pdf'), handlePdfUpload);

export default router;
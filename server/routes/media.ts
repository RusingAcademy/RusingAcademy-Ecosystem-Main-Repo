import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, validateImage, IMAGE_PRESETS, type ImagePreset } from '../lib/cloudinary';
import { createDirectUpload, getUploadStatus, validateVideo } from '../lib/mux';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB for images
  },
});

// Upload image to Cloudinary
router.post('/upload/image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { preset = 'cover', folder = 'rusingacademy' } = req.body;

    // Validate preset
    if (preset && !IMAGE_PRESETS[preset as ImagePreset]) {
      return res.status(400).json({ error: 'Invalid preset' });
    }

    // Validate image
    const validation = validateImage(req.file.size, req.file.mimetype);
    if (!validation.valid) {
      // Still upload but with auto-optimization
      console.log('Image validation warning:', validation.error);
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file.buffer, {
      folder,
      preset: preset as ImagePreset,
    });

    res.json({
      success: true,
      message: validation.valid ? 'Image uploaded successfully' : 'Image optimized and uploaded',
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get Mux direct upload URL for video
router.post('/upload/video/create', async (req: Request, res: Response) => {
  try {
    const { corsOrigin, passthrough } = req.body;

    const upload = await createDirectUpload({
      corsOrigin: corsOrigin || req.headers.origin || '*',
      newAssetSettings: {
        playbackPolicy: ['public'],
        passthrough,
      },
    });

    res.json({
      success: true,
      data: {
        uploadUrl: upload.uploadUrl,
        uploadId: upload.uploadId,
      },
    });
  } catch (error) {
    console.error('Video upload creation error:', error);
    res.status(500).json({ error: 'Failed to create video upload' });
  }
});

// Check video upload/encoding status
router.get('/upload/video/status/:uploadId', async (req: Request, res: Response) => {
  try {
    const { uploadId } = req.params;
    const status = await getUploadStatus(uploadId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Video status check error:', error);
    res.status(500).json({ error: 'Failed to check video status' });
  }
});

// Validate video before upload (client-side check)
router.post('/upload/video/validate', (req: Request, res: Response) => {
  const { fileSize, mimeType } = req.body;

  if (!fileSize || !mimeType) {
    return res.status(400).json({ error: 'Missing fileSize or mimeType' });
  }

  const validation = validateVideo(fileSize, mimeType);

  res.json({
    success: true,
    data: validation,
  });
});

export default router;

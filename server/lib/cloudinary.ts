import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Image presets with dimensions and quality budgets
export const IMAGE_PRESETS = {
  coach_avatar: {
    width: 256,
    height: 256,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
    format: 'webp',
    maxFileSize: 40 * 1024, // 40 KB
  },
  coach_card: {
    width: 480,
    height: 480,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
    format: 'webp',
    maxFileSize: 80 * 1024, // 80 KB
  },
  cover: {
    width: 1200,
    height: 675,
    crop: 'fill',
    quality: 'auto:good',
    format: 'webp',
    maxFileSize: 120 * 1024, // 120 KB
  },
  hero_desktop: {
    width: 1920,
    height: 1080,
    crop: 'fill',
    quality: 'auto:good',
    format: 'webp',
    maxFileSize: 180 * 1024, // 180 KB
  },
  hero_4k: {
    width: 3840,
    height: 2160,
    crop: 'fill',
    quality: 'auto:eco',
    format: 'webp',
    maxFileSize: 400 * 1024, // 400 KB
  },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

// Generate Cloudinary URL with preset transformations
export function getCloudinaryUrl(
  publicId: string,
  preset: ImagePreset
): string {
  const config = IMAGE_PRESETS[preset];
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: config.width,
        height: config.height,
        crop: config.crop,
        gravity: config.gravity,
        quality: config.quality,
        format: config.format,
      },
    ],
  });
}

// Generate srcset for responsive images
export function getCloudinarySrcSet(
  publicId: string,
  preset: ImagePreset
): { srcSet: string; sizes: string } {
  const config = IMAGE_PRESETS[preset];
  const widths = [config.width * 0.5, config.width * 0.75, config.width, config.width * 1.5].map(Math.round);
  
  const srcSet = widths
    .map((w) => {
      const url = cloudinary.url(publicId, {
        transformation: [
          {
            width: w,
            height: Math.round((w / config.width) * config.height),
            crop: config.crop,
            gravity: config.gravity,
            quality: config.quality,
            format: config.format,
          },
        ],
      });
      return `${url} ${w}w`;
    })
    .join(', ');

  const sizes = `(max-width: ${config.width}px) 100vw, ${config.width}px`;

  return { srcSet, sizes };
}

// Upload image to Cloudinary with validation
export async function uploadImage(
  file: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    preset?: ImagePreset;
  } = {}
): Promise<UploadApiResponse> {
  const uploadOptions: UploadApiOptions = {
    folder: options.folder || 'rusingacademy',
    public_id: options.publicId,
    resource_type: 'image',
    overwrite: true,
    // Auto-compress if too large
    transformation: [
      {
        quality: 'auto:good',
        format: 'webp',
      },
    ],
  };

  // Apply preset transformations if specified
  if (options.preset) {
    const presetConfig = IMAGE_PRESETS[options.preset];
    uploadOptions.transformation = [
      {
        width: presetConfig.width,
        height: presetConfig.height,
        crop: presetConfig.crop,
        gravity: presetConfig.gravity,
        quality: presetConfig.quality,
        format: presetConfig.format,
      },
    ];
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error('Upload failed'));
      }
    );

    if (typeof file === 'string') {
      // URL or base64
      cloudinary.uploader.upload(file, uploadOptions)
        .then(resolve)
        .catch(reject);
    } else {
      // Buffer
      uploadStream.end(file);
    }
  });
}

// Validate image before upload
export function validateImage(
  fileSize: number,
  mimeType: string
): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (fileSize > MAX_SIZE) {
    return {
      valid: false,
      error: 'Image size exceeds 10 MB. It will be automatically optimized.',
    };
  }

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: 'Invalid image format. Please use JPEG, PNG, WebP, or GIF.',
    };
  }

  return { valid: true };
}

export default cloudinary;

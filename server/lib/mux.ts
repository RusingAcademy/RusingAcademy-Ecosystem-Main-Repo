import Mux from '@mux/mux-node';

// Initialize Mux client
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Video upload settings
export const VIDEO_SETTINGS = {
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5 GB
  allowedFormats: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'],
  encodingProfiles: ['360p', '720p', '1080p', '4k'],
};

// Create a direct upload URL for client-side uploads
export async function createDirectUpload(options: {
  corsOrigin?: string;
  newAssetSettings?: {
    playbackPolicy?: Array<'public' | 'signed'>;
    passthrough?: string;
  };
} = {}): Promise<{
  uploadUrl: string;
  uploadId: string;
}> {
  const upload = await mux.video.uploads.create({
    cors_origin: options.corsOrigin || '*',
    new_asset_settings: {
      playback_policy: options.newAssetSettings?.playbackPolicy || ['public'],
      passthrough: options.newAssetSettings?.passthrough,
      // Enable all encoding tiers for adaptive streaming
      encoding_tier: 'smart',
    },
  });

  return {
    uploadUrl: upload.url,
    uploadId: upload.id,
  };
}

// Get asset details by ID
export async function getAsset(assetId: string) {
  return await mux.video.assets.retrieve(assetId);
}

// Get playback ID for an asset
export async function getPlaybackId(assetId: string): Promise<string | null> {
  const asset = await getAsset(assetId);
  return asset.playback_ids?.[0]?.id || null;
}

// Get poster/thumbnail URL for a video
export function getPosterUrl(playbackId: string, options: {
  time?: number;
  width?: number;
  height?: number;
  format?: 'jpg' | 'png' | 'webp';
} = {}): string {
  const { time = 0, width = 1920, height = 1080, format = 'webp' } = options;
  return `https://image.mux.com/${playbackId}/thumbnail.${format}?time=${time}&width=${width}&height=${height}`;
}

// Get animated GIF preview
export function getAnimatedGifUrl(playbackId: string, options: {
  start?: number;
  end?: number;
  width?: number;
  fps?: number;
} = {}): string {
  const { start = 0, end = 5, width = 480, fps = 10 } = options;
  return `https://image.mux.com/${playbackId}/animated.gif?start=${start}&end=${end}&width=${width}&fps=${fps}`;
}

// Get HLS stream URL
export function getStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

// Validate video before upload
export function validateVideo(
  fileSize: number,
  mimeType: string
): { valid: boolean; error?: string } {
  if (fileSize > VIDEO_SETTINGS.maxFileSize) {
    return {
      valid: false,
      error: 'Video size exceeds 5 GB. Please compress your video.',
    };
  }

  if (!VIDEO_SETTINGS.allowedFormats.includes(mimeType)) {
    return {
      valid: false,
      error: 'Invalid video format. Please use MP4, MOV, or AVI.',
    };
  }

  return { valid: true };
}

// Delete an asset
export async function deleteAsset(assetId: string): Promise<void> {
  await mux.video.assets.delete(assetId);
}

// Get upload status
export async function getUploadStatus(uploadId: string): Promise<{
  status: string;
  assetId?: string;
}> {
  const upload = await mux.video.uploads.retrieve(uploadId);
  return {
    status: upload.status,
    assetId: upload.asset_id,
  };
}

export default mux;

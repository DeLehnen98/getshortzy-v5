/**
 * Social Media API Configuration
 * 
 * Centralized configuration for TikTok, YouTube, and Instagram APIs
 */

export const SOCIAL_PLATFORMS = {
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
} as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[keyof typeof SOCIAL_PLATFORMS];

/**
 * TikTok API Configuration
 * https://developers.tiktok.com/
 */
export const TIKTOK_CONFIG = {
  apiBaseUrl: 'https://open.tiktokapis.com',
  authUrl: 'https://www.tiktok.com/v2/auth/authorize',
  tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
  clientKey: process.env.TIKTOK_CLIENT_KEY || '',
  clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/tiktok/callback',
  scopes: [
    'user.info.basic',
    'video.upload',
    'video.publish',
  ],
};

/**
 * YouTube API Configuration
 * https://developers.google.com/youtube/v3
 */
export const YOUTUBE_CONFIG = {
  apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
  uploadUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  clientId: process.env.YOUTUBE_CLIENT_ID || '',
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/youtube/callback',
  scopes: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ],
};

/**
 * Instagram API Configuration (Meta Graph API)
 * https://developers.facebook.com/docs/instagram-api
 */
export const INSTAGRAM_CONFIG = {
  apiBaseUrl: 'https://graph.facebook.com/v18.0',
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  appId: process.env.INSTAGRAM_APP_ID || '',
  appSecret: process.env.INSTAGRAM_APP_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/instagram/callback',
  scopes: [
    'instagram_basic',
    'instagram_content_publish',
    'pages_read_engagement',
  ],
};

/**
 * Video upload constraints per platform
 */
export const PLATFORM_CONSTRAINTS = {
  tiktok: {
    maxFileSize: 287 * 1024 * 1024, // 287 MB
    maxDuration: 180, // 3 minutes (for Shorts: 60s)
    minDuration: 3,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    formats: ['mp4', 'mov', 'webm'],
    maxTitleLength: 150,
    maxDescriptionLength: 2200,
    maxHashtags: 30,
  },
  youtube: {
    maxFileSize: 256 * 1024 * 1024, // 256 MB for Shorts
    maxDuration: 60, // 60 seconds for Shorts
    minDuration: 1,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
    maxTags: 500, // characters
  },
  instagram: {
    maxFileSize: 100 * 1024 * 1024, // 100 MB
    maxDuration: 90, // 90 seconds for Reels
    minDuration: 3,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    formats: ['mp4', 'mov'],
    maxCaptionLength: 2200,
    maxHashtags: 30,
  },
} as const;

/**
 * OAuth state management
 */
export interface OAuthState {
  platform: SocialPlatform;
  userId: string;
  clipId?: string;
  returnUrl?: string;
}

/**
 * Social media account connection status
 */
export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  platformUsername: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post status
 */
export enum PostStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  PUBLISHED = 'published',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
}

/**
 * Social media post
 */
export interface SocialPost {
  id: string;
  userId: string;
  clipId: string;
  platform: SocialPlatform;
  accountId: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  status: PostStatus;
  platformPostId?: string;
  platformUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  scheduledFor?: Date;
  publishedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validate video against platform constraints
 */
export function validateVideoForPlatform(
  platform: SocialPlatform,
  fileSize: number,
  duration: number,
  format: string
): { valid: boolean; errors: string[] } {
  const constraints = PLATFORM_CONSTRAINTS[platform];
  const errors: string[] = [];

  if (fileSize > constraints.maxFileSize) {
    errors.push(
      `File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum (${(constraints.maxFileSize / 1024 / 1024).toFixed(0)}MB)`
    );
  }

  if (duration > constraints.maxDuration) {
    errors.push(
      `Duration (${duration}s) exceeds maximum (${constraints.maxDuration}s)`
    );
  }

  if (duration < constraints.minDuration) {
    errors.push(
      `Duration (${duration}s) is below minimum (${constraints.minDuration}s)`
    );
  }

  if (!constraints.formats.includes(format.toLowerCase() as any)) {
    errors.push(
      `Format ${format} is not supported. Supported: ${constraints.formats.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthUrl(platform: SocialPlatform, state: string): string {
  switch (platform) {
    case SOCIAL_PLATFORMS.TIKTOK:
      const tiktokParams = new URLSearchParams({
        client_key: TIKTOK_CONFIG.clientKey,
        scope: TIKTOK_CONFIG.scopes.join(','),
        response_type: 'code',
        redirect_uri: TIKTOK_CONFIG.redirectUri,
        state,
      });
      return `${TIKTOK_CONFIG.authUrl}?${tiktokParams.toString()}`;

    case SOCIAL_PLATFORMS.YOUTUBE:
      const youtubeParams = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.clientId,
        redirect_uri: YOUTUBE_CONFIG.redirectUri,
        response_type: 'code',
        scope: YOUTUBE_CONFIG.scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        state,
      });
      return `${YOUTUBE_CONFIG.authUrl}?${youtubeParams.toString()}`;

    case SOCIAL_PLATFORMS.INSTAGRAM:
      const instagramParams = new URLSearchParams({
        client_id: INSTAGRAM_CONFIG.appId,
        redirect_uri: INSTAGRAM_CONFIG.redirectUri,
        scope: INSTAGRAM_CONFIG.scopes.join(','),
        response_type: 'code',
        state,
      });
      return `${INSTAGRAM_CONFIG.authUrl}?${instagramParams.toString()}`;

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}


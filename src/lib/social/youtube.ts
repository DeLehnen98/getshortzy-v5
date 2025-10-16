import { YOUTUBE_CONFIG } from './config';
import { google } from 'googleapis';

export class YouTubeAPI {
  private accessToken: string;
  private refreshToken?: string;

  constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  /**
   * Exchange authorization code for access token
   */
  static async getAccessToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch(YOUTUBE_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: YOUTUBE_CONFIG.clientId,
        client_secret: YOUTUBE_CONFIG.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: YOUTUBE_CONFIG.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`YouTube token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const response = await fetch(YOUTUBE_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: YOUTUBE_CONFIG.clientId,
        client_secret: YOUTUBE_CONFIG.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`YouTube token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Get OAuth2 client
   */
  private getOAuth2Client() {
    const oauth2Client = new google.auth.OAuth2(
      YOUTUBE_CONFIG.clientId,
      YOUTUBE_CONFIG.clientSecret,
      YOUTUBE_CONFIG.redirectUri
    );

    oauth2Client.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });

    return oauth2Client;
  }

  /**
   * Get channel info
   */
  async getChannelInfo(): Promise<{
    id: string;
    title: string;
    thumbnailUrl: string;
  }> {
    const oauth2Client = this.getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.channels.list({
      part: ['snippet'],
      mine: true,
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      throw new Error('No YouTube channel found');
    }

    return {
      id: channel.id!,
      title: channel.snippet?.title || '',
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url || '',
    };
  }

  /**
   * Upload video as YouTube Short
   */
  async uploadShort(params: {
    videoPath: string;
    title: string;
    description?: string;
    tags?: string[];
    privacyStatus?: 'public' | 'private' | 'unlisted';
  }): Promise<{
    videoId: string;
    url: string;
  }> {
    const oauth2Client = this.getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Add #Shorts to title or description to mark as Short
    const title = params.title.includes('#Shorts')
      ? params.title
      : `${params.title} #Shorts`;

    const description = params.description || '';

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags: params.tags,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: params.privacyStatus || 'public',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: require('fs').createReadStream(params.videoPath),
      },
    });

    const videoId = response.data.id!;

    return {
      videoId,
      url: `https://www.youtube.com/shorts/${videoId}`,
    };
  }

  /**
   * Upload video from URL
   */
  async uploadShortFromUrl(params: {
    videoUrl: string;
    title: string;
    description?: string;
    tags?: string[];
    privacyStatus?: 'public' | 'private' | 'unlisted';
  }): Promise<{
    videoId: string;
    url: string;
  }> {
    // Download video first
    const videoResponse = await fetch(params.videoUrl);
    const videoBuffer = await videoResponse.arrayBuffer();

    // Create temporary file
    const fs = require('fs');
    const path = require('path');
    const tmpPath = path.join('/tmp', `youtube_${Date.now()}.mp4`);

    fs.writeFileSync(tmpPath, Buffer.from(videoBuffer));

    try {
      // Upload video
      const result = await this.uploadShort({
        videoPath: tmpPath,
        title: params.title,
        description: params.description,
        tags: params.tags,
        privacyStatus: params.privacyStatus,
      });

      return result;
    } finally {
      // Cleanup
      fs.unlinkSync(tmpPath);
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
  }> {
    const oauth2Client = this.getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.videos.list({
      part: ['statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];

    if (!video) {
      throw new Error('Video not found');
    }

    return {
      views: parseInt(video.statistics?.viewCount || '0'),
      likes: parseInt(video.statistics?.likeCount || '0'),
      comments: parseInt(video.statistics?.commentCount || '0'),
    };
  }

  /**
   * Update video details
   */
  async updateVideo(params: {
    videoId: string;
    title?: string;
    description?: string;
    tags?: string[];
    privacyStatus?: 'public' | 'private' | 'unlisted';
  }): Promise<void> {
    const oauth2Client = this.getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    await youtube.videos.update({
      part: ['snippet', 'status'],
      requestBody: {
        id: params.videoId,
        snippet: {
          title: params.title,
          description: params.description,
          tags: params.tags,
          categoryId: '22',
        },
        status: {
          privacyStatus: params.privacyStatus,
        },
      },
    });
  }

  /**
   * Delete video
   */
  async deleteVideo(videoId: string): Promise<void> {
    const oauth2Client = this.getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    await youtube.videos.delete({
      id: videoId,
    });
  }
}


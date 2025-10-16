import { TIKTOK_CONFIG } from './config';

export class TikTokAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Exchange authorization code for access token
   */
  static async getAccessToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    openId: string;
  }> {
    const response = await fetch(TIKTOK_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CONFIG.clientKey,
        client_secret: TIKTOK_CONFIG.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TIKTOK_CONFIG.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TikTok token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresIn: data.data.expires_in,
      openId: data.data.open_id,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch(TIKTOK_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CONFIG.clientKey,
        client_secret: TIKTOK_CONFIG.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TikTok token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresIn: data.data.expires_in,
    };
  }

  /**
   * Get user info
   */
  async getUserInfo(): Promise<{
    openId: string;
    unionId: string;
    displayName: string;
    avatarUrl: string;
  }> {
    const response = await fetch(
      `${TIKTOK_CONFIG.apiBaseUrl}/v2/user/info/?fields=open_id,union_id,display_name,avatar_url`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TikTok user info failed: ${error}`);
    }

    const data = await response.json();

    return {
      openId: data.data.user.open_id,
      unionId: data.data.user.union_id,
      displayName: data.data.user.display_name,
      avatarUrl: data.data.user.avatar_url,
    };
  }

  /**
   * Upload video to TikTok
   */
  async uploadVideo(params: {
    videoUrl: string;
    title: string;
    description?: string;
    privacyLevel?: 'PUBLIC' | 'SELF_ONLY' | 'MUTUAL_FOLLOW_FRIENDS';
    disableComment?: boolean;
    disableDuet?: boolean;
    disableStitch?: boolean;
  }): Promise<{
    publishId: string;
    shareUrl: string;
  }> {
    // Step 1: Initialize upload
    const initResponse = await fetch(
      `${TIKTOK_CONFIG.apiBaseUrl}/v2/post/publish/video/init/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: {
            title: params.title,
            description: params.description || '',
            privacy_level: params.privacyLevel || 'PUBLIC',
            disable_comment: params.disableComment || false,
            disable_duet: params.disableDuet || false,
            disable_stitch: params.disableStitch || false,
          },
          source_info: {
            source: 'FILE_URL',
            video_url: params.videoUrl,
          },
        }),
      }
    );

    if (!initResponse.ok) {
      const error = await initResponse.text();
      throw new Error(`TikTok upload init failed: ${error}`);
    }

    const initData = await initResponse.json();

    return {
      publishId: initData.data.publish_id,
      shareUrl: initData.data.share_url || '',
    };
  }

  /**
   * Check upload status
   */
  async checkUploadStatus(publishId: string): Promise<{
    status: 'PROCESSING_UPLOAD' | 'SEND_TO_USER_INBOX' | 'PUBLISH_COMPLETE' | 'FAILED';
    failReason?: string;
  }> {
    const response = await fetch(
      `${TIKTOK_CONFIG.apiBaseUrl}/v2/post/publish/status/${publishId}/`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TikTok status check failed: ${error}`);
    }

    const data = await response.json();

    return {
      status: data.data.status,
      failReason: data.data.fail_reason,
    };
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }> {
    const response = await fetch(
      `${TIKTOK_CONFIG.apiBaseUrl}/v2/video/query/?fields=view_count,like_count,comment_count,share_count&filters.video_ids=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TikTok analytics failed: ${error}`);
    }

    const data = await response.json();
    const video = data.data.videos[0];

    return {
      views: video?.view_count || 0,
      likes: video?.like_count || 0,
      comments: video?.comment_count || 0,
      shares: video?.share_count || 0,
    };
  }
}


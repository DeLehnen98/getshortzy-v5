import { INSTAGRAM_CONFIG } from './config';

export class InstagramAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Exchange authorization code for access token
   */
  static async getAccessToken(code: string): Promise<{
    accessToken: string;
    userId: string;
  }> {
    const response = await fetch(INSTAGRAM_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CONFIG.appId,
        client_secret: INSTAGRAM_CONFIG.appSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_CONFIG.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      userId: data.user_id,
    };
  }

  /**
   * Get long-lived access token (60 days)
   */
  static async getLongLivedToken(shortLivedToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: INSTAGRAM_CONFIG.appSecret,
      access_token: shortLivedToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/access_token?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram long-lived token failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh long-lived token
   */
  static async refreshToken(accessToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/refresh_access_token?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Get user info
   */
  async getUserInfo(): Promise<{
    id: string;
    username: string;
    accountType: string;
  }> {
    const params = new URLSearchParams({
      fields: 'id,username,account_type',
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/me?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram user info failed: ${error}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.username,
      accountType: data.account_type,
    };
  }

  /**
   * Get Instagram Business Account ID from Facebook Page
   */
  async getInstagramBusinessAccountId(facebookPageId: string): Promise<string> {
    const params = new URLSearchParams({
      fields: 'instagram_business_account',
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${facebookPageId}?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram business account failed: ${error}`);
    }

    const data = await response.json();

    return data.instagram_business_account?.id;
  }

  /**
   * Create Reel container
   */
  async createReelContainer(params: {
    igUserId: string;
    videoUrl: string;
    caption?: string;
    shareToFeed?: boolean;
    coverUrl?: string;
  }): Promise<string> {
    const body = new URLSearchParams({
      media_type: 'REELS',
      video_url: params.videoUrl,
      caption: params.caption || '',
      share_to_feed: params.shareToFeed ? 'true' : 'false',
      access_token: this.accessToken,
    });

    if (params.coverUrl) {
      body.append('thumb_offset', '0');
    }

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${params.igUserId}/media`,
      {
        method: 'POST',
        body,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram create container failed: ${error}`);
    }

    const data = await response.json();

    return data.id; // Container ID
  }

  /**
   * Check container status
   */
  async checkContainerStatus(containerId: string): Promise<{
    status: 'IN_PROGRESS' | 'FINISHED' | 'ERROR';
    statusCode?: string;
  }> {
    const params = new URLSearchParams({
      fields: 'status_code',
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${containerId}?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram status check failed: ${error}`);
    }

    const data = await response.json();

    return {
      status: data.status_code === 'FINISHED' ? 'FINISHED' : 'IN_PROGRESS',
      statusCode: data.status_code,
    };
  }

  /**
   * Publish Reel
   */
  async publishReel(params: {
    igUserId: string;
    containerId: string;
  }): Promise<{
    mediaId: string;
    permalink: string;
  }> {
    const body = new URLSearchParams({
      creation_id: params.containerId,
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${params.igUserId}/media_publish`,
      {
        method: 'POST',
        body,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram publish failed: ${error}`);
    }

    const data = await response.json();

    // Get permalink
    const permalinkResponse = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${data.id}?fields=permalink&access_token=${this.accessToken}`
    );

    const permalinkData = await permalinkResponse.json();

    return {
      mediaId: data.id,
      permalink: permalinkData.permalink,
    };
  }

  /**
   * Upload Reel (complete flow)
   */
  async uploadReel(params: {
    igUserId: string;
    videoUrl: string;
    caption?: string;
    shareToFeed?: boolean;
    maxRetries?: number;
  }): Promise<{
    mediaId: string;
    permalink: string;
  }> {
    const maxRetries = params.maxRetries || 30;

    // Step 1: Create container
    const containerId = await this.createReelContainer({
      igUserId: params.igUserId,
      videoUrl: params.videoUrl,
      caption: params.caption,
      shareToFeed: params.shareToFeed,
    });

    // Step 2: Wait for processing
    let retries = 0;
    let status: 'IN_PROGRESS' | 'FINISHED' | 'ERROR' = 'IN_PROGRESS';

    while (status === 'IN_PROGRESS' && retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

      const statusCheck = await this.checkContainerStatus(containerId);
      status = statusCheck.status;

      retries++;
    }

    if (status !== 'FINISHED') {
      throw new Error('Instagram Reel processing failed or timed out');
    }

    // Step 3: Publish
    const result = await this.publishReel({
      igUserId: params.igUserId,
      containerId,
    });

    return result;
  }

  /**
   * Get Reel analytics
   */
  async getReelAnalytics(mediaId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }> {
    const params = new URLSearchParams({
      fields: 'like_count,comments_count',
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${mediaId}?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram analytics failed: ${error}`);
    }

    const data = await response.json();

    // Get insights (views, shares)
    const insightsParams = new URLSearchParams({
      metric: 'plays,shares',
      access_token: this.accessToken,
    });

    const insightsResponse = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${mediaId}/insights?${insightsParams.toString()}`
    );

    const insightsData = await insightsResponse.json();

    const views =
      insightsData.data?.find((m: any) => m.name === 'plays')?.values[0]
        ?.value || 0;
    const shares =
      insightsData.data?.find((m: any) => m.name === 'shares')?.values[0]
        ?.value || 0;

    return {
      views,
      likes: data.like_count || 0,
      comments: data.comments_count || 0,
      shares,
    };
  }

  /**
   * Delete Reel
   */
  async deleteReel(mediaId: string): Promise<void> {
    const params = new URLSearchParams({
      access_token: this.accessToken,
    });

    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${mediaId}?${params.toString()}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram delete failed: ${error}`);
    }
  }
}


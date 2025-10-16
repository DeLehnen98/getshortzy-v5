import { db } from '~/server/db';
import { QueueManager } from './manager';
import { JobType } from './config';

export interface BatchJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

export class BatchProcessor {
  /**
   * Process multiple videos in batch
   */
  static async processVideoBatch(
    userId: string,
    videos: Array<{
      name: string;
      sourceType: 'upload' | 'youtube';
      sourceUrl?: string;
      fileUrl?: string;
      preset: string;
      platform: string;
    }>,
    options: {
      userTier?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
      priority?: number;
    } = {}
  ): Promise<string> {
    const { userTier = 'free', priority } = options;

    // Create batch record
    const batchId = `batch_${Date.now()}`;
    const totalJobs = videos.length;

    // Create projects for each video
    const projectIds: string[] = [];

    for (const video of videos) {
      const project = await db.project.create({
        data: {
          userId,
          name: video.name,
          sourceType: video.sourceType,
          sourceUrl: video.sourceUrl,
          fileUrl: video.fileUrl,
          preset: video.preset,
          platform: video.platform,
          status: 'pending',
        },
      });

      projectIds.push(project.id);
    }

    // Enqueue all jobs
    const jobs = projectIds.map((projectId) => ({
      type: JobType.BATCH_PROCESS,
      userId,
      projectId,
      data: {
        batchId,
        totalJobs,
      },
    }));

    await QueueManager.enqueueBatch(jobs, { userTier, priority });

    return batchId;
  }

  /**
   * Get batch status
   */
  static async getBatchStatus(batchId: string): Promise<BatchJob | null> {
    const jobs = await db.job.findMany({
      where: {
        result: {
          path: ['batchId'],
          equals: batchId,
        },
      },
    });

    if (jobs.length === 0) return null;

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter((j) => j.status === 'completed').length;
    const failedJobs = jobs.filter((j) => j.status === 'failed').length;
    const progress = Math.round((completedJobs / totalJobs) * 100);

    let status: BatchJob['status'] = 'pending';
    if (completedJobs + failedJobs === totalJobs) {
      status = failedJobs > 0 ? 'failed' : 'completed';
    } else if (completedJobs > 0) {
      status = 'processing';
    }

    return {
      id: batchId,
      name: `Batch ${batchId}`,
      status,
      totalJobs,
      completedJobs,
      failedJobs,
      progress,
      createdAt: jobs[0]?.createdAt || new Date(),
      completedAt:
        status === 'completed' || status === 'failed'
          ? jobs[jobs.length - 1]?.completedAt || new Date()
          : undefined,
    };
  }

  /**
   * Process YouTube playlist
   */
  static async processPlaylist(
    userId: string,
    playlistUrl: string,
    options: {
      preset: string;
      platform: string;
      userTier?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
      maxVideos?: number;
    }
  ): Promise<string> {
    const { preset, platform, userTier = 'free', maxVideos = 50 } = options;

    // TODO: Implement YouTube playlist parsing
    // For now, return a placeholder batch ID
    const batchId = `playlist_${Date.now()}`;

    // Example: Extract video URLs from playlist
    const videoUrls: string[] = [];
    // const videoUrls = await extractPlaylistVideos(playlistUrl, maxVideos);

    const videos = videoUrls.map((url, index) => ({
      name: `Video ${index + 1} from playlist`,
      sourceType: 'youtube' as const,
      sourceUrl: url,
      preset,
      platform,
    }));

    return this.processVideoBatch(userId, videos, { userTier });
  }

  /**
   * Schedule batch processing for off-peak hours
   */
  static async scheduleBatch(
    userId: string,
    videos: Array<{
      name: string;
      sourceType: 'upload' | 'youtube';
      sourceUrl?: string;
      fileUrl?: string;
      preset: string;
      platform: string;
    }>,
    scheduledFor: Date,
    options: {
      userTier?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
    } = {}
  ): Promise<string> {
    const { userTier = 'free' } = options;

    // Create batch record with scheduled status
    const batchId = `scheduled_${Date.now()}`;

    // TODO: Implement scheduled batch processing
    // This would use Inngest's scheduled events or a cron job

    return batchId;
  }

  /**
   * Get batch processing recommendations
   */
  static async getRecommendations(userId: string): Promise<{
    recommendBatch: boolean;
    reason: string;
    estimatedSavings?: number;
  }> {
    // Count pending projects
    const pendingProjects = await db.project.count({
      where: {
        userId,
        status: 'pending',
      },
    });

    if (pendingProjects >= 5) {
      return {
        recommendBatch: true,
        reason: 'You have multiple pending videos. Batch processing can save time.',
        estimatedSavings: Math.round(pendingProjects * 0.2), // 20% time savings
      };
    }

    return {
      recommendBatch: false,
      reason: 'Not enough pending videos for batch processing.',
    };
  }

  /**
   * Cancel batch processing
   */
  static async cancelBatch(batchId: string): Promise<boolean> {
    const jobs = await db.job.findMany({
      where: {
        result: {
          path: ['batchId'],
          equals: batchId,
        },
        status: 'pending',
      },
    });

    if (jobs.length === 0) return false;

    // Cancel all pending jobs
    await db.job.updateMany({
      where: {
        id: { in: jobs.map((j) => j.id) },
      },
      data: {
        status: 'failed',
        error: 'Batch cancelled by user',
        completedAt: new Date(),
      },
    });

    return true;
  }

  /**
   * Retry failed jobs in batch
   */
  static async retryBatch(batchId: string): Promise<number> {
    const failedJobs = await db.job.findMany({
      where: {
        result: {
          path: ['batchId'],
          equals: batchId,
        },
        status: 'failed',
      },
    });

    let retriedCount = 0;

    for (const job of failedJobs) {
      const newJobId = await QueueManager.retryJob(job.id);
      if (newJobId) retriedCount++;
    }

    return retriedCount;
  }
}


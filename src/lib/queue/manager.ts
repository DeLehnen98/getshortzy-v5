import { db } from '~/server/db';
import { inngest } from '~/server/inngest/client';
import {
  QueuePriority,
  JobType,
  calculateJobPriority,
  CONCURRENCY_LIMITS,
  JOB_TIMEOUTS,
  RETRY_CONFIG,
} from './config';

export interface QueueJob {
  id: string;
  type: JobType;
  priority: number;
  userId: string;
  projectId: string;
  data: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class QueueManager {
  /**
   * Enqueue a new job with priority
   */
  static async enqueue(
    type: JobType,
    userId: string,
    projectId: string,
    data: Record<string, any>,
    options: {
      userTier?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
      isUrgent?: boolean;
      priority?: number;
    } = {}
  ): Promise<string> {
    const { userTier = 'free', isUrgent = false, priority } = options;

    // Calculate priority
    const jobPriority =
      priority ?? calculateJobPriority(userTier, type, isUrgent);

    // Create job record
    const job = await db.job.create({
      data: {
        projectId,
        type,
        status: 'pending',
        progress: 0,
        result: {
          priority: jobPriority,
          userId,
          ...data,
        },
      },
    });

    // Send to Inngest with priority
    await this.sendToInngest(type, {
      jobId: job.id,
      projectId,
      userId,
      priority: jobPriority,
      ...data,
    });

    return job.id;
  }

  /**
   * Enqueue multiple jobs as a batch
   */
  static async enqueueBatch(
    jobs: Array<{
      type: JobType;
      userId: string;
      projectId: string;
      data: Record<string, any>;
    }>,
    options: {
      userTier?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
      priority?: number;
    } = {}
  ): Promise<string[]> {
    const { userTier = 'free', priority } = options;

    const jobIds: string[] = [];

    for (const job of jobs) {
      const jobPriority =
        priority ?? calculateJobPriority(userTier, job.type, false);

      const dbJob = await db.job.create({
        data: {
          projectId: job.projectId,
          type: job.type,
          status: 'pending',
          progress: 0,
          result: {
            priority: jobPriority,
            userId: job.userId,
            ...job.data,
          },
        },
      });

      jobIds.push(dbJob.id);

      // Send to Inngest
      await this.sendToInngest(job.type, {
        jobId: dbJob.id,
        projectId: job.projectId,
        userId: job.userId,
        priority: jobPriority,
        ...job.data,
      });
    }

    return jobIds;
  }

  /**
   * Get job status
   */
  static async getJobStatus(jobId: string): Promise<QueueJob | null> {
    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) return null;

    return {
      id: job.id,
      type: job.type as JobType,
      priority: (job.result as any)?.priority || QueuePriority.NORMAL,
      userId: (job.result as any)?.userId || '',
      projectId: job.projectId,
      data: job.result as Record<string, any>,
      attempts: 0, // TODO: Track attempts
      maxAttempts: RETRY_CONFIG[job.type as JobType]?.maxAttempts || 1,
      status: job.status as any,
      error: job.error || undefined,
      createdAt: job.createdAt,
      startedAt: job.startedAt || undefined,
      completedAt: job.completedAt || undefined,
    };
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats() {
    const [
      totalJobs,
      pendingJobs,
      runningJobs,
      completedJobs,
      failedJobs,
    ] = await Promise.all([
      db.job.count(),
      db.job.count({ where: { status: 'pending' } }),
      db.job.count({ where: { status: 'running' } }),
      db.job.count({ where: { status: 'completed' } }),
      db.job.count({ where: { status: 'failed' } }),
      // Placeholder for average completion time calculation
      Promise.resolve({ _avg: { progress: 0 } }),
    ]);

    // Get jobs by type
    const jobsByType = await db.job.groupBy({
      by: ['type'],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    return {
      total: totalJobs,
      pending: pendingJobs,
      running: runningJobs,
      completed: completedJobs,
      failed: failedJobs,
      errorRate: totalJobs > 0 ? failedJobs / totalJobs : 0,
      jobsByType: jobsByType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    };
  }

  /**
   * Cancel a job
   */
  static async cancelJob(jobId: string): Promise<boolean> {
    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== 'pending') {
      return false;
    }

    await db.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: 'Cancelled by user',
        completedAt: new Date(),
      },
    });

    return true;
  }

  /**
   * Retry a failed job
   */
  static async retryJob(jobId: string): Promise<string | null> {
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { project: true },
    });

    if (!job || job.status !== 'failed') {
      return null;
    }

    const result = job.result as any;

    // Create new job
    const newJobId = await this.enqueue(
      job.type as JobType,
      result.userId,
      job.projectId,
      result,
      {
        userTier: result.userTier,
        isUrgent: result.isUrgent,
        priority: result.priority,
      }
    );

    return newJobId;
  }

  /**
   * Clean up old completed jobs
   */
  static async cleanup(olderThanDays: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await db.job.deleteMany({
      where: {
        status: 'completed',
        completedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }

  /**
   * Send job to Inngest based on type
   */
  private static async sendToInngest(
    type: JobType,
    data: Record<string, any>
  ): Promise<void> {
    const eventMap: Record<JobType, string> = {
      [JobType.VIDEO_DOWNLOAD]: 'video/download',
      [JobType.AUDIO_EXTRACT]: 'audio/extract',
      [JobType.TRANSCRIPTION]: 'transcription/process',
      [JobType.VIRAL_ANALYSIS]: 'viral/analyze',
      [JobType.CLIP_GENERATION]: 'clip/generate',
      [JobType.BATCH_PROCESS]: 'batch/process',
    };

    const eventName = eventMap[type];

    if (!eventName) {
      throw new Error(`Unknown job type: ${type}`);
    }

    await inngest.send({
      name: eventName,
      data,
    });
  }
}


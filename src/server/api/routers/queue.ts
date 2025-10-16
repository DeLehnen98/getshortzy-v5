import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { QueueManager } from '~/lib/queue/manager';
import { BatchProcessor } from '~/lib/queue/batch-processor';
import { PerformanceMonitor } from '~/lib/monitoring/performance';
import { JobType } from '~/lib/queue/config';

export const queueRouter = createTRPCRouter({
  /**
   * Get queue statistics
   */
  getStats: protectedProcedure.query(async () => {
    const stats = await QueueManager.getQueueStats();
    return stats;
  }),

  /**
   * Get job status
   */
  getJobStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input }) => {
      const job = await QueueManager.getJobStatus(input.jobId);
      return job;
    }),

  /**
   * Cancel a job
   */
  cancelJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input }) => {
      const success = await QueueManager.cancelJob(input.jobId);
      return { success };
    }),

  /**
   * Retry a failed job
   */
  retryJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ input }) => {
      const newJobId = await QueueManager.retryJob(input.jobId);
      return { success: !!newJobId, newJobId };
    }),

  /**
   * Process batch of videos
   */
  processBatch: protectedProcedure
    .input(
      z.object({
        videos: z.array(
          z.object({
            name: z.string(),
            sourceType: z.enum(['upload', 'youtube']),
            sourceUrl: z.string().optional(),
            fileUrl: z.string().optional(),
            preset: z.string(),
            platform: z.string(),
          })
        ),
        userTier: z
          .enum(['free', 'starter', 'pro', 'business', 'enterprise'])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const batchId = await BatchProcessor.processVideoBatch(
        user.id,
        input.videos,
        {
          userTier: input.userTier || 'free',
        }
      );

      return { batchId };
    }),

  /**
   * Get batch status
   */
  getBatchStatus: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ input }) => {
      const batch = await BatchProcessor.getBatchStatus(input.batchId);
      return batch;
    }),

  /**
   * Cancel batch
   */
  cancelBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .mutation(async ({ input }) => {
      const success = await BatchProcessor.cancelBatch(input.batchId);
      return { success };
    }),

  /**
   * Retry failed jobs in batch
   */
  retryBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .mutation(async ({ input }) => {
      const retriedCount = await BatchProcessor.retryBatch(input.batchId);
      return { retriedCount };
    }),

  /**
   * Get batch recommendations
   */
  getBatchRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const recommendations = await BatchProcessor.getRecommendations(user.id);
    return recommendations;
  }),

  /**
   * Get performance summary
   */
  getPerformanceSummary: protectedProcedure
    .input(
      z
        .object({
          timeRange: z.enum(['hour', 'day', 'week']).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const summary = await PerformanceMonitor.getPerformanceSummary(
        input?.timeRange || 'day'
      );
      return summary;
    }),

  /**
   * Get system health
   */
  getSystemHealth: protectedProcedure.query(async () => {
    const health = await PerformanceMonitor.getSystemHealth();
    return health;
  }),

  /**
   * Identify bottlenecks
   */
  getBottlenecks: protectedProcedure.query(async () => {
    const bottlenecks = await PerformanceMonitor.identifyBottlenecks();
    return bottlenecks;
  }),

  /**
   * Clean up old jobs
   */
  cleanupJobs: protectedProcedure
    .input(
      z.object({
        olderThanDays: z.number().min(1).max(90).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const deletedCount = await QueueManager.cleanup(
        input.olderThanDays || 7
      );
      return { deletedCount };
    }),
});


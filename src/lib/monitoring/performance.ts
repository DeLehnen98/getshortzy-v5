import { db } from '~/server/db';

export interface PerformanceMetrics {
  timestamp: Date;
  metric: string;
  value: number;
  unit: string;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  /**
   * Track processing time for a job
   */
  static async trackJobDuration(
    jobId: string,
    jobType: string,
    durationMs: number
  ): Promise<void> {
    await this.recordMetric({
      timestamp: new Date(),
      metric: `job.duration.${jobType}`,
      value: durationMs,
      unit: 'milliseconds',
      metadata: { jobId },
    });
  }

  /**
   * Track queue size
   */
  static async trackQueueSize(queueName: string, size: number): Promise<void> {
    await this.recordMetric({
      timestamp: new Date(),
      metric: `queue.size.${queueName}`,
      value: size,
      unit: 'count',
      metadata: { queueName },
    });
  }

  /**
   * Track error rate
   */
  static async trackErrorRate(
    jobType: string,
    errorRate: number
  ): Promise<void> {
    await this.recordMetric({
      timestamp: new Date(),
      metric: `job.error_rate.${jobType}`,
      value: errorRate,
      unit: 'percentage',
      metadata: { jobType },
    });
  }

  /**
   * Track API latency
   */
  static async trackApiLatency(
    endpoint: string,
    latencyMs: number
  ): Promise<void> {
    await this.recordMetric({
      timestamp: new Date(),
      metric: `api.latency.${endpoint}`,
      value: latencyMs,
      unit: 'milliseconds',
      metadata: { endpoint },
    });
  }

  /**
   * Get performance summary
   */
  static async getPerformanceSummary(
    timeRange: 'hour' | 'day' | 'week' = 'day'
  ): Promise<{
    avgJobDuration: Record<string, number>;
    queueSizes: Record<string, number>;
    errorRates: Record<string, number>;
    apiLatencies: Record<string, number>;
  }> {
    const cutoffDate = new Date();
    if (timeRange === 'hour') {
      cutoffDate.setHours(cutoffDate.getHours() - 1);
    } else if (timeRange === 'day') {
      cutoffDate.setDate(cutoffDate.getDate() - 1);
    } else {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    }

    // Get job durations
    const jobs = await db.job.findMany({
      where: {
        status: 'completed',
        startedAt: { gte: cutoffDate },
        completedAt: { not: null },
      },
    });

    const avgJobDuration: Record<string, number> = {};
    const jobsByType: Record<string, number[]> = {};

    jobs.forEach((job) => {
      if (job.startedAt && job.completedAt) {
        const duration =
          job.completedAt.getTime() - job.startedAt.getTime();
        if (!jobsByType[job.type]) {
          jobsByType[job.type] = [];
        }
        jobsByType[job.type].push(duration);
      }
    });

    Object.entries(jobsByType).forEach(([type, durations]) => {
      avgJobDuration[type] =
        durations.reduce((a, b) => a + b, 0) / durations.length;
    });

    // Get current queue sizes
    const queueSizes: Record<string, number> = {
      pending: await db.job.count({ where: { status: 'pending' } }),
      running: await db.job.count({ where: { status: 'running' } }),
    };

    // Calculate error rates
    const errorRates: Record<string, number> = {};
    const jobTypes = await db.job.groupBy({
      by: ['type'],
      _count: true,
      where: { createdAt: { gte: cutoffDate } },
    });

    for (const { type, _count } of jobTypes) {
      const failedCount = await db.job.count({
        where: {
          type,
          status: 'failed',
          createdAt: { gte: cutoffDate },
        },
      });
      errorRates[type] = _count > 0 ? failedCount / _count : 0;
    }

    // API latencies would come from actual API monitoring
    const apiLatencies: Record<string, number> = {};

    return {
      avgJobDuration,
      queueSizes,
      errorRates,
      apiLatencies,
    };
  }

  /**
   * Get system health status
   */
  static async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
    metrics: {
      queueSize: number;
      errorRate: number;
      avgProcessingTime: number;
    };
  }> {
    const summary = await this.getPerformanceSummary('hour');

    const queueSize = summary.queueSizes.pending || 0;
    const totalErrors = Object.values(summary.errorRates).reduce(
      (a, b) => a + b,
      0
    );
    const errorRate =
      Object.keys(summary.errorRates).length > 0
        ? totalErrors / Object.keys(summary.errorRates).length
        : 0;
    const avgProcessingTime =
      Object.values(summary.avgJobDuration).reduce((a, b) => a + b, 0) /
      (Object.keys(summary.avgJobDuration).length || 1);

    const issues: string[] = [];
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    // Check queue size
    if (queueSize > 1000) {
      issues.push('Queue size is critically high');
      status = 'critical';
    } else if (queueSize > 500) {
      issues.push('Queue size is elevated');
      if (status === 'healthy') status = 'degraded';
    }

    // Check error rate
    if (errorRate > 0.2) {
      issues.push('Error rate is critically high');
      status = 'critical';
    } else if (errorRate > 0.1) {
      issues.push('Error rate is elevated');
      if (status === 'healthy') status = 'degraded';
    }

    // Check processing time
    if (avgProcessingTime > 600000) {
      // 10 minutes
      issues.push('Average processing time is too high');
      if (status === 'healthy') status = 'degraded';
    }

    return {
      status,
      issues,
      metrics: {
        queueSize,
        errorRate,
        avgProcessingTime,
      },
    };
  }

  /**
   * Get resource utilization
   */
  static async getResourceUtilization(): Promise<{
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  }> {
    // TODO: Implement actual resource monitoring
    // This would integrate with Vercel/infrastructure monitoring

    return {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0,
    };
  }

  /**
   * Record a performance metric
   */
  private static async recordMetric(
    metric: PerformanceMetrics
  ): Promise<void> {
    // TODO: Implement actual metric storage
    // This could use a time-series database, logging service, or analytics platform
    console.log('[Performance Metric]', metric);
  }

  /**
   * Get bottlenecks in the system
   */
  static async identifyBottlenecks(): Promise<
    Array<{
      component: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }>
  > {
    const summary = await this.getPerformanceSummary('day');
    const bottlenecks: Array<{
      component: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }> = [];

    // Check for slow job types
    Object.entries(summary.avgJobDuration).forEach(([type, duration]) => {
      if (duration > 300000) {
        // 5 minutes
        bottlenecks.push({
          component: type,
          severity: 'high',
          description: `${type} jobs are taking ${Math.round(
            duration / 1000
          )}s on average`,
          recommendation: 'Consider optimizing the processing pipeline or adding more workers',
        });
      } else if (duration > 120000) {
        // 2 minutes
        bottlenecks.push({
          component: type,
          severity: 'medium',
          description: `${type} jobs are taking ${Math.round(
            duration / 1000
          )}s on average`,
          recommendation: 'Monitor performance and consider optimization',
        });
      }
    });

    // Check for high error rates
    Object.entries(summary.errorRates).forEach(([type, rate]) => {
      if (rate > 0.1) {
        bottlenecks.push({
          component: type,
          severity: 'high',
          description: `${type} has ${(rate * 100).toFixed(1)}% error rate`,
          recommendation: 'Investigate error logs and implement fixes',
        });
      }
    });

    return bottlenecks;
  }
}


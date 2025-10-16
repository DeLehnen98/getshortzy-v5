/**
 * Queue Configuration for GetShortzy
 * 
 * Defines priority levels, concurrency limits, and queue settings
 * for efficient video processing at scale.
 */

export enum QueuePriority {
  URGENT = 100,    // Paying customers, critical jobs
  HIGH = 75,       // Premium users, time-sensitive
  NORMAL = 50,     // Regular users
  LOW = 25,        // Batch jobs, background tasks
  BACKGROUND = 0,  // Analytics, cleanup
}

export enum JobType {
  VIDEO_DOWNLOAD = 'video.download',
  AUDIO_EXTRACT = 'audio.extract',
  TRANSCRIPTION = 'transcription.process',
  VIRAL_ANALYSIS = 'viral.analyze',
  CLIP_GENERATION = 'clip.generate',
  BATCH_PROCESS = 'batch.process',
}

/**
 * Concurrency limits per job type
 * Prevents resource exhaustion and ensures fair distribution
 */
export const CONCURRENCY_LIMITS = {
  [JobType.VIDEO_DOWNLOAD]: 5,      // Network-bound
  [JobType.AUDIO_EXTRACT]: 3,       // CPU-intensive
  [JobType.TRANSCRIPTION]: 2,       // GPU/CPU-intensive
  [JobType.VIRAL_ANALYSIS]: 5,      // API-bound
  [JobType.CLIP_GENERATION]: 3,     // CPU/GPU-intensive
  [JobType.BATCH_PROCESS]: 2,       // Resource-intensive
} as const;

/**
 * Timeout settings per job type (in seconds)
 */
export const JOB_TIMEOUTS = {
  [JobType.VIDEO_DOWNLOAD]: 300,    // 5 minutes
  [JobType.AUDIO_EXTRACT]: 180,     // 3 minutes
  [JobType.TRANSCRIPTION]: 600,     // 10 minutes
  [JobType.VIRAL_ANALYSIS]: 120,    // 2 minutes
  [JobType.CLIP_GENERATION]: 300,   // 5 minutes
  [JobType.BATCH_PROCESS]: 1800,    // 30 minutes
} as const;

/**
 * Retry configuration per job type
 */
export const RETRY_CONFIG = {
  [JobType.VIDEO_DOWNLOAD]: {
    maxAttempts: 3,
    backoffStrategy: 'exponential' as const,
    initialDelay: 1000,  // 1 second
  },
  [JobType.AUDIO_EXTRACT]: {
    maxAttempts: 2,
    backoffStrategy: 'exponential' as const,
    initialDelay: 2000,  // 2 seconds
  },
  [JobType.TRANSCRIPTION]: {
    maxAttempts: 2,
    backoffStrategy: 'linear' as const,
    initialDelay: 5000,  // 5 seconds
  },
  [JobType.VIRAL_ANALYSIS]: {
    maxAttempts: 3,
    backoffStrategy: 'exponential' as const,
    initialDelay: 1000,  // 1 second
  },
  [JobType.CLIP_GENERATION]: {
    maxAttempts: 2,
    backoffStrategy: 'exponential' as const,
    initialDelay: 3000,  // 3 seconds
  },
  [JobType.BATCH_PROCESS]: {
    maxAttempts: 1,
    backoffStrategy: 'none' as const,
    initialDelay: 0,
  },
} as const;

/**
 * User tier to priority mapping
 */
export const USER_TIER_PRIORITY = {
  free: QueuePriority.LOW,
  starter: QueuePriority.NORMAL,
  pro: QueuePriority.HIGH,
  business: QueuePriority.HIGH,
  enterprise: QueuePriority.URGENT,
} as const;

/**
 * Calculate job priority based on user tier and job type
 */
export function calculateJobPriority(
  userTier: keyof typeof USER_TIER_PRIORITY,
  jobType: JobType,
  isUrgent: boolean = false
): number {
  let basePriority = USER_TIER_PRIORITY[userTier] || QueuePriority.NORMAL;

  // Boost priority for urgent jobs
  if (isUrgent) {
    basePriority = Math.min(basePriority + 25, QueuePriority.URGENT);
  }

  // Adjust based on job type
  if (jobType === JobType.CLIP_GENERATION) {
    basePriority += 10; // Clips are user-facing, boost priority
  }

  return Math.min(basePriority, QueuePriority.URGENT);
}

/**
 * Queue health thresholds
 */
export const QUEUE_HEALTH = {
  HEALTHY: {
    queueSize: 100,
    avgWaitTime: 60,      // 1 minute
    errorRate: 0.05,      // 5%
  },
  WARNING: {
    queueSize: 500,
    avgWaitTime: 300,     // 5 minutes
    errorRate: 0.10,      // 10%
  },
  CRITICAL: {
    queueSize: 1000,
    avgWaitTime: 600,     // 10 minutes
    errorRate: 0.20,      // 20%
  },
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  free: {
    videosPerHour: 3,
    videosPerDay: 10,
    concurrentJobs: 1,
  },
  starter: {
    videosPerHour: 10,
    videosPerDay: 50,
    concurrentJobs: 2,
  },
  pro: {
    videosPerHour: 50,
    videosPerDay: 200,
    concurrentJobs: 5,
  },
  business: {
    videosPerHour: 200,
    videosPerDay: 1000,
    concurrentJobs: 10,
  },
  enterprise: {
    videosPerHour: -1,    // Unlimited
    videosPerDay: -1,     // Unlimited
    concurrentJobs: 20,
  },
} as const;

/**
 * Get rate limit for user tier
 */
export function getRateLimit(userTier: keyof typeof RATE_LIMITS) {
  return RATE_LIMITS[userTier] || RATE_LIMITS.free;
}

/**
 * Check if user has exceeded rate limit
 */
export async function checkRateLimit(
  userId: string,
  userTier: keyof typeof RATE_LIMITS,
  period: 'hour' | 'day'
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const limits = getRateLimit(userTier);
  const limit = period === 'hour' ? limits.videosPerHour : limits.videosPerDay;

  // If unlimited, always allow
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      resetAt: new Date(Date.now() + (period === 'hour' ? 3600000 : 86400000)),
    };
  }

  // TODO: Implement actual rate limit checking with Redis or similar
  // For now, return allowed
  return {
    allowed: true,
    remaining: limit,
    resetAt: new Date(Date.now() + (period === 'hour' ? 3600000 : 86400000)),
  };
}


import { db } from '~/server/db';

/**
 * Credit costs for different actions
 */
export const CREDIT_COSTS = {
  VIDEO_UPLOAD: 1,
  TRANSCRIPTION: 0, // Included in upload
  VIRAL_ANALYSIS: 0, // Included in upload
  CLIP_GENERATION: 0, // Included in upload (up to 5 clips)
  ADDITIONAL_CLIP: 0.2, // Per clip beyond first 5
  YOUTUBE_IMPORT: 1, // Same as upload
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

/**
 * Check if user has enough credits for an action
 */
export async function hasEnoughCredits(
  userId: string,
  action: CreditAction
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { credits: true },
  });

  if (!user) {
    return false;
  }

  const cost = CREDIT_COSTS[action];
  return user.credits >= cost;
}

/**
 * Deduct credits from user for an action
 */
export async function deductCredits(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, any>
): Promise<{ success: boolean; remainingCredits: number }> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const cost = CREDIT_COSTS[action];

  if (user.credits < cost) {
    throw new Error('Insufficient credits');
  }

  // Deduct credits
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      credits: {
        decrement: cost,
      },
    },
  });

  // Log usage
  await db.usageLog.create({
    data: {
      userId: user.id,
      action,
      credits: cost,
      metadata,
    },
  });

  // Create transaction record
  await db.transaction.create({
    data: {
      userId: user.id,
      type: 'usage',
      amount: -cost,
      description: `Used ${cost} credit(s) for ${action}`,
      metadata: {
        action,
        ...metadata,
      },
    },
  });

  return {
    success: true,
    remainingCredits: updatedUser.credits,
  };
}

/**
 * Add credits to user (for purchases or refunds)
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number }> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      credits: {
        increment: amount,
      },
    },
  });

  // Create transaction record
  await db.transaction.create({
    data: {
      userId: user.id,
      type: 'purchase',
      amount,
      description: reason,
      metadata,
    },
  });

  return {
    success: true,
    newBalance: updatedUser.credits,
  };
}

/**
 * Get user's credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { credits: true },
  });

  return user?.credits || 0;
}

/**
 * Get user's usage statistics
 */
export async function getUserUsageStats(userId: string) {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const [totalUsage, usageByAction, recentUsage] = await Promise.all([
    // Total credits used
    db.usageLog.aggregate({
      where: { userId: user.id },
      _sum: { credits: true },
    }),

    // Usage breakdown by action
    db.usageLog.groupBy({
      by: ['action'],
      where: { userId: user.id },
      _sum: { credits: true },
      _count: true,
    }),

    // Recent usage logs
    db.usageLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    totalCreditsUsed: totalUsage._sum.credits || 0,
    usageByAction: usageByAction.map((item) => ({
      action: item.action,
      credits: item._sum.credits || 0,
      count: item._count,
    })),
    recentUsage,
  };
}

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(
  userId: string,
  limit: number = 20
) {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return transactions;
}

/**
 * Check if user needs to purchase credits
 */
export async function needsCredits(
  userId: string,
  requiredCredits: number = 1
): Promise<boolean> {
  const balance = await getCreditBalance(userId);
  return balance < requiredCredits;
}

/**
 * Refund credits to user
 */
export async function refundCredits(
  userId: string,
  amount: number,
  reason: string,
  originalTransactionId?: string
): Promise<{ success: boolean; newBalance: number }> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      credits: {
        increment: amount,
      },
    },
  });

  await db.transaction.create({
    data: {
      userId: user.id,
      type: 'refund',
      amount,
      description: reason,
      metadata: {
        originalTransactionId,
      },
    },
  });

  return {
    success: true,
    newBalance: updatedUser.credits,
  };
}


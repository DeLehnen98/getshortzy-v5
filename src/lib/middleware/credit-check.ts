import { hasEnoughCredits, deductCredits, type CreditAction } from '../credits/usage-tracker';

/**
 * Middleware to check and deduct credits before an action
 */
export async function withCreditCheck<T>(
  userId: string,
  action: CreditAction,
  callback: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  // Check if user has enough credits
  const hasCredits = await hasEnoughCredits(userId, action);

  if (!hasCredits) {
    throw new Error(`Insufficient credits for ${action}. Please purchase more credits.`);
  }

  // Execute the callback
  const result = await callback();

  // Deduct credits after successful execution
  await deductCredits(userId, action, metadata);

  return result;
}

/**
 * Check credits without deducting (for UI display)
 */
export async function checkCreditsOnly(
  userId: string,
  action: CreditAction
): Promise<{ hasCredits: boolean; message?: string }> {
  const hasCredits = await hasEnoughCredits(userId, action);

  if (!hasCredits) {
    return {
      hasCredits: false,
      message: `You don't have enough credits for this action. Please purchase more credits.`,
    };
  }

  return { hasCredits: true };
}


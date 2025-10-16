import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PaymentService, CREDIT_PACKAGES } from "~/lib/payments/payment-service";
import {
  getCreditBalance,
  getUserUsageStats,
  getTransactionHistory,
  hasEnoughCredits,
  CREDIT_COSTS,
} from "~/lib/credits/usage-tracker";

export const billingRouter = createTRPCRouter({
  /**
   * Get user's credit balance
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const balance = await getCreditBalance(ctx.userId);
    return { credits: balance };
  }),

  /**
   * Get available credit packages
   */
  getPackages: protectedProcedure.query(async () => {
    return CREDIT_PACKAGES;
  }),

  /**
   * Get credit costs for actions
   */
  getCosts: protectedProcedure.query(async () => {
    return CREDIT_COSTS;
  }),

  /**
   * Check if user has enough credits for an action
   */
  checkCredits: protectedProcedure
    .input(
      z.object({
        action: z.enum([
          "VIDEO_UPLOAD",
          "TRANSCRIPTION",
          "VIRAL_ANALYSIS",
          "CLIP_GENERATION",
          "ADDITIONAL_CLIP",
          "YOUTUBE_IMPORT",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      const hasCredits = await hasEnoughCredits(ctx.userId, input.action);
      const balance = await getCreditBalance(ctx.userId);
      const cost = CREDIT_COSTS[input.action];

      return {
        hasEnoughCredits: hasCredits,
        currentBalance: balance,
        requiredCredits: cost,
        shortfall: hasCredits ? 0 : cost - balance,
      };
    }),

  /**
   * Get user's usage statistics
   */
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await getUserUsageStats(ctx.userId);
    return stats;
  }),

  /**
   * Get transaction history
   */
  getTransactions: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const transactions = await getTransactionHistory(
        ctx.userId,
        input?.limit || 20
      );
      return transactions;
    }),

  /**
   * Create checkout session for purchasing credits
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
        provider: z.enum(["stripe", "paypal"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const session = await PaymentService.createCheckoutSession(
        user.id,
        user.email,
        input.packageId,
        input.provider || "stripe"
      );

      return session;
    }),

  /**
   * Get billing summary
   */
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const [stats, recentTransactions] = await Promise.all([
      getUserUsageStats(ctx.userId),
      getTransactionHistory(ctx.userId, 5),
    ]);

    // Calculate total spent
    const totalSpent = await ctx.db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "purchase",
      },
      _sum: {
        amount: true,
      },
    });

    // Get project count
    const projectCount = await ctx.db.project.count({
      where: { userId: user.id },
    });

    // Get clip count
    const clipCount = await ctx.db.clip.count({
      where: {
        project: {
          userId: user.id,
        },
      },
    });

    return {
      currentBalance: user.credits,
      totalCreditsUsed: stats.totalCreditsUsed,
      totalCreditsPurchased: totalSpent._sum.amount || 0,
      projectsCreated: projectCount,
      clipsGenerated: clipCount,
      recentTransactions,
      usageByAction: stats.usageByAction,
    };
  }),

  /**
   * Get recommended package based on usage
   */
  getRecommendedPackage: protectedProcedure.query(async ({ ctx }) => {
    const stats = await getUserUsageStats(ctx.userId);
    const balance = await getCreditBalance(ctx.userId);

    // Calculate average monthly usage
    const monthlyUsage = stats.totalCreditsUsed; // Simplified

    // Recommend package based on usage
    let recommendedPackage = CREDIT_PACKAGES[0]; // Default to starter

    if (monthlyUsage > 100) {
      recommendedPackage = CREDIT_PACKAGES[2]; // Agency
    } else if (monthlyUsage > 30) {
      recommendedPackage = CREDIT_PACKAGES[1]; // Creator
    }

    return {
      package: recommendedPackage,
      reason:
        balance < 5
          ? "Your balance is low"
          : "Based on your usage pattern",
      currentBalance: balance,
      estimatedMonthlyUsage: monthlyUsage,
    };
  }),
});


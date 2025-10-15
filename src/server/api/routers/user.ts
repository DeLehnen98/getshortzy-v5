import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    let user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    // Create user if doesn't exist
    if (!user) {
      user = await ctx.db.user.create({
        data: {
          clerkId: ctx.userId,
          email: `${ctx.userId}@temp.com`, // Will be updated from Clerk webhook
        },
      });
    }

    return user;
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    if (!user) {
      return {
        credits: 0,
        projectsCount: 0,
        clipsCount: 0,
        totalUsage: 0,
      };
    }

    const [projectsCount, clipsCount, usageLogs] = await Promise.all([
      ctx.db.project.count({ where: { userId: user.id } }),
      ctx.db.clip.count({
        where: { project: { userId: user.id } },
      }),
      ctx.db.usageLog.findMany({
        where: { userId: user.id },
      }),
    ]);

    const totalUsage = usageLogs.reduce((sum, log) => sum + log.credits, 0);

    return {
      credits: user.credits,
      projectsCount,
      clipsCount,
      totalUsage,
    };
  }),

  getUsageHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        return [];
      }

      return ctx.db.usageLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
    }),
});


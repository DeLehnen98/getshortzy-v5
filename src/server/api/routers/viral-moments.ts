import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inngest } from "~/server/inngest/client";

export const viralMomentsRouter = createTRPCRouter({
  /**
   * Get all viral moments for a project
   */
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const moments = await ctx.db.viralMoment.findMany({
        where: { projectId: input.projectId },
        orderBy: { score: 'desc' }
      });
      return moments;
    }),

  /**
   * Get a single viral moment by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const moment = await ctx.db.viralMoment.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              fileUrl: true
            }
          }
        }
      });
      return moment;
    }),

  /**
   * Trigger viral moment analysis for a project
   */
  analyzeProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify project exists and belongs to user
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          user: {
            clerkId: ctx.userId
          }
        },
        include: {
          transcription: true
        }
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (!project.transcription) {
        throw new Error("Project must be transcribed first");
      }

      // Trigger Inngest workflow
      await inngest.send({
        name: "video/analyze-viral-moments",
        data: {
          projectId: input.projectId
        }
      });

      return {
        success: true,
        message: "Viral moment analysis started"
      };
    }),

  /**
   * Get viral moments statistics
   */
  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const moments = await ctx.db.viralMoment.findMany({
        where: { projectId: input.projectId }
      });

      if (moments.length === 0) {
        return {
          totalMoments: 0,
          averageScore: 0,
          topScore: 0,
          typeDistribution: {}
        };
      }

      const totalMoments = moments.length;
      const averageScore = moments.reduce((sum, m) => sum + m.score, 0) / totalMoments;
      const topScore = Math.max(...moments.map(m => m.score));
      
      const typeDistribution = moments.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalMoments,
        averageScore: Math.round(averageScore),
        topScore,
        typeDistribution
      };
    }),

  /**
   * Delete a viral moment
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify moment belongs to user's project
      const moment = await ctx.db.viralMoment.findUnique({
        where: { id: input.id },
        include: {
          project: {
            include: {
              user: true
            }
          }
        }
      });

      if (!moment || moment.project.user.clerkId !== ctx.userId) {
        throw new Error("Viral moment not found");
      }

      await ctx.db.viralMoment.delete({
        where: { id: input.id }
      });

      return { success: true };
    }),

  /**
   * Update viral moment metadata
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      description: z.string().optional(),
      score: z.number().min(0).max(100).optional(),
      type: z.enum(["story", "question", "hook", "punchline", "insight"]).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify moment belongs to user's project
      const moment = await ctx.db.viralMoment.findUnique({
        where: { id },
        include: {
          project: {
            include: {
              user: true
            }
          }
        }
      });

      if (!moment || moment.project.user.clerkId !== ctx.userId) {
        throw new Error("Viral moment not found");
      }

      const updated = await ctx.db.viralMoment.update({
        where: { id },
        data: updateData
      });

      return updated;
    })
});


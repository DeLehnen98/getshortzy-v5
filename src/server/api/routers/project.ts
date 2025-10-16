import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inngest } from "~/server/inngest/client";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        sourceType: z.enum(["upload", "youtube"]),
        sourceUrl: z.string().optional(),
        preset: z.enum(["viral", "balanced", "volume"]),
        platform: z.enum(["tiktok", "youtube", "instagram", "all"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user from database
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check credits
      if (user.credits < 1) {
        throw new Error("Insufficient credits");
      }

      // Create project
      const project = await ctx.db.project.create({
        data: {
          userId: user.id,
          name: input.name,
          description: input.description,
          sourceType: input.sourceType,
          sourceUrl: input.sourceUrl,
          preset: input.preset,
          platform: input.platform,
          status: "pending",
        },
      });

      // Deduct credit
      await ctx.db.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      });

      // Log usage
      await ctx.db.usageLog.create({
        data: {
          userId: user.id,
          action: "video_upload",
          credits: 1,
          metadata: { projectId: project.id },
        },
      });

      // Trigger Inngest workflow
      await inngest.send({
        name: "project/process",
        data: {
          projectId: project.id,
          sourceType: input.sourceType,
          sourceUrl: input.sourceUrl,
          preset: input.preset,
          platform: input.platform,
        },
      });

      return project;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    if (!user) {
      return [];
    }

    return ctx.db.project.findMany({
      where: { userId: user.id },
      include: {
        clips: true,
        _count: {
          select: { clips: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.project.findFirst({
        where: {
          id: input.id,
          userId: user.id,
        },
        include: {
          clips: {
            orderBy: { viralScore: "desc" },
          },
          jobs: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.project.delete({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      return { success: true };
    }),

  startTranscription: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Get project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          userId: user.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Update status
      await ctx.db.project.update({
        where: { id: input.projectId },
        data: {
          transcriptionStatus: "processing",
        },
      });

      // Trigger transcription workflow
      await inngest.send({
        name: "video/transcribe",
        data: {
          projectId: input.projectId,
        },
      });

      return { success: true };
    }),
});


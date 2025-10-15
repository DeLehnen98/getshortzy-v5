import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const clipRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        return [];
      }

      // Verify project belongs to user
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          userId: user.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.clip.findMany({
        where: { projectId: input.projectId },
        orderBy: { viralScore: "desc" },
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

      const clip = await ctx.db.clip.findUnique({
        where: { id: input.id },
        include: {
          project: true,
        },
      });

      if (!clip || clip.project.userId !== user.id) {
        throw new Error("Clip not found");
      }

      return clip;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const clip = await ctx.db.clip.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!clip || clip.project.userId !== user.id) {
        throw new Error("Clip not found");
      }

      return ctx.db.clip.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
});


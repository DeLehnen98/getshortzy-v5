import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transcriptionRouter = createTRPCRouter({
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const transcription = await ctx.db.transcription.findUnique({
        where: { projectId: input.projectId },
      });
      return transcription;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transcription = await ctx.db.transcription.findUnique({
        where: { id: input.id },
      });
      return transcription;
    }),
});


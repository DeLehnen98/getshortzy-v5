import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { projectRouter } from "~/server/api/routers/project";
import { userRouter } from "~/server/api/routers/user";
import { clipRouter } from "~/server/api/routers/clip";
import { transcriptionRouter } from "~/server/api/routers/transcription";
import { viralMomentsRouter } from "~/server/api/routers/viral-moments";
// import { billingRouter } from "~/server/api/routers/billing"; // Removed - depends on deleted payments lib
import { queueRouter } from "~/server/api/routers/queue";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  clip: clipRouter,
  transcription: transcriptionRouter,
  viralMoments: viralMomentsRouter,
  // billing: billingRouter, // Removed - depends on deleted payments lib
  queue: queueRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);


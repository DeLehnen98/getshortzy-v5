import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// import { projectRouter } from "~/server/api/routers/project"; // Temporarily disabled for debugging
import { userRouter } from "~/server/api/routers/user";
// import { clipRouter } from "~/server/api/routers/clip"; // Temporarily disabled for debugging
// import { transcriptionRouter } from "~/server/api/routers/transcription"; // Temporarily disabled for debugging
// import { viralMomentsRouter } from "~/server/api/routers/viral-moments"; // Temporarily disabled for debugging
// import { billingRouter } from "~/server/api/routers/billing"; // Removed - depends on deleted payments lib
// import { queueRouter } from "~/server/api/routers/queue"; // Temporarily disabled for debugging

export const appRouter = createTRPCRouter({
  // project: projectRouter, // Temporarily disabled for debugging
  user: userRouter,
  // clip: clipRouter, // Temporarily disabled for debugging
  // transcription: transcriptionRouter, // Temporarily disabled for debugging
  // viralMoments: viralMomentsRouter, // Temporarily disabled for debugging
  // billing: billingRouter, // Removed - depends on deleted payments lib
  // queue: queueRouter, // Temporarily disabled for debugging
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);


import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { projectRouter } from "~/server/api/routers/project";
import { userRouter } from "~/server/api/routers/user";
import { clipRouter } from "~/server/api/routers/clip";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  clip: clipRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);


import { serve } from "inngest/next";
import { inngest } from "~/server/inngest/client";
import { processVideo } from "~/server/inngest/functions/process-video";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processVideo],
});


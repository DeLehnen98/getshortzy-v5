import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
// import { processVideo } from "~/server/inngest/functions/process-video"; // Removed
import { transcribeVideo } from "@/inngest/transcribe";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [transcribeVideo], // Removed processVideo
});


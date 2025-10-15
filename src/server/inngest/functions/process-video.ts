import { inngest } from "../client";
import { db } from "~/server/db";
import { processVideoWithAI } from "~/lib/video-processor";

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    name: "Process Video and Generate Clips",
  },
  { event: "project/process" },
  async ({ event, step }) => {
    const { projectId, sourceType, sourceUrl, preset, platform } = event.data;

    // Update project status
    await step.run("update-status-processing", async () => {
      await db.project.update({
        where: { id: projectId },
        data: { status: "processing" },
      });
    });

    // Download/fetch video
    const videoPath = await step.run("download-video", async () => {
      if (sourceType === "youtube" && sourceUrl) {
        // Download from YouTube
        return await downloadYouTubeVideo(sourceUrl);
      } else {
        // Handle uploaded video
        return sourceUrl;
      }
    });

    // Process video with AI
    const clips = await step.run("process-with-ai", async () => {
      return await processVideoWithAI({
        videoPath: videoPath!,
        preset,
        platform,
      });
    });

    // Save clips to database
    await step.run("save-clips", async () => {
      for (const clip of clips) {
        await db.clip.create({
          data: {
            projectId,
            title: clip.title,
            description: clip.description,
            url: clip.url,
            thumbnailUrl: clip.thumbnailUrl,
            duration: clip.duration,
            viralScore: clip.viralScore,
            status: "ready",
            metadata: clip.metadata,
          },
        });
      }
    });

    // Update project status
    await step.run("update-status-completed", async () => {
      await db.project.update({
        where: { id: projectId },
        data: { status: "completed" },
      });
    });

    return { success: true, clipsCount: clips.length };
  }
);

async function downloadYouTubeVideo(url: string): Promise<string> {
  // Implement YouTube download logic
  // This would use yt-dlp or similar
  return "/tmp/video.mp4";
}


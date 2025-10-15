import { inngest } from "../client";
import { db } from "~/server/db";
import { VideoProcessor } from "~/lib/video-processor";

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    name: "Process Video",
  },
  { event: "video/process" },
  async ({ event, step }) => {
    const { projectId, videoUrl, preset, platform } = event.data;

    await step.run("update-status-processing", async () => {
      await db.project.update({
        where: { id: projectId },
        data: { status: "PROCESSING" },
      });
    });

    const clips = await step.run("process-video", async () => {
      const processor = new VideoProcessor();
      return await processor.processVideo({
        videoUrl,
        preset,
        platform,
      });
    });

    await step.run("save-clips", async () => {
      for (const clip of clips) {
        await db.clip.create({
          data: {
            projectId,
            title: clip.title,
            description: clip.description,
            url: clip.videoUrl || videoUrl,
            thumbnailUrl: clip.thumbnailUrl,
            duration: clip.duration,
            viralScore: clip.viralScore,
            status: "ready",
            metadata: {
              startTime: clip.startTime,
              endTime: clip.endTime,
            },
          },
        });
      }
    });

    await step.run("update-status-completed", async () => {
      await db.project.update({
        where: { id: projectId },
        data: {
          status: "completed",
          updatedAt: new Date(),
        },
      });
    });

    return { success: true, clipsCount: clips.length };
  }
);

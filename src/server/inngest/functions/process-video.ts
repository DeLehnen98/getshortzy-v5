import { inngest } from "../client";
import { db } from "~/server/db";
import { VideoProcessor } from "~/lib/video-processor";
import { analyzeVideoWithAI } from "~/lib/ai/video-analyzer";
import { generateClips } from "~/lib/video/clip-generator";
import { downloadYouTubeVideo, getYouTubeVideoInfo } from "~/lib/video/youtube-downloader";

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

    // Download video if YouTube URL
    const videoPath = await step.run("download-video", async () => {
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        return await downloadYouTubeVideo(videoUrl);
      }
      return videoUrl;
    });

    // Analyze video with AI
    const analysis = await step.run("analyze-video", async () => {
      return await analyzeVideoWithAI(videoPath, {
        platform: platform as any,
        duration: preset === "viral" ? 30 : preset === "balanced" ? 45 : 60,
      });
    });

    // Generate clips
    const clips = await step.run("generate-clips", async () => {
      return await generateClips(videoPath, analysis.moments, {
        outputFormat: "mp4",
        resolution: platform === "tiktok" || platform === "instagram" ? "1080x1920" : "1920x1080",
      });
    });

    await step.run("save-clips", async () => {
      for (const clip of clips) {
        await db.clip.create({
          data: {
            projectId,
            title: clip.title,
            description: clip.description,
            url: clip.url,
            thumbnailUrl: clip.thumbnail,
            duration: clip.duration,
            viralScore: clip.viralScore,
            status: "ready",
            platform: platform,
            metadata: {
              startTime: clip.startTime,
              endTime: clip.endTime,
              tags: clip.tags,
              effects: clip.effects,
              captions: clip.captions,
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

import { inngest } from '@/lib/inngest';
import { db } from '@/lib/db';
import { generateClips } from '@/lib/video/clip-generator';
import { 
  generateASS, 
  extractSubtitleSegments,
  type SubtitlePreset 
} from '@/lib/video/subtitle-generator';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export const generateClip = inngest.createFunction(
  {
    id: 'generate-clip',
    name: 'Generate Video Clip'
  },
  { event: 'clip/generate' },
  async ({ event, step }) => {
    const { projectId, startTime, endTime, title, viralScore, type } = event.data;

    // Step 1: Get project data
    const project = await step.run('fetch-project-data', async () => {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
          transcription: true,
          viralMoments: {
            where: {
              startTime: Math.floor(startTime),
              endTime: Math.floor(endTime)
            }
          }
        }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      if (!project.fileUrl) {
        throw new Error('No video file found');
      }

      return project;
    });

    // Step 2: Create clip record in database
    const clipRecord = await step.run('create-clip-record', async () => {
      return await db.clip.create({
        data: {
          projectId,
          title: title || 'Viral Clip',
          description: `Viral moment from ${project.name}`,
          url: '', // Will be updated after generation
          duration: Math.floor(endTime - startTime),
          status: 'PROCESSING',
          viralScore: viralScore || 75,
          startTime: Math.floor(startTime),
          endTime: Math.floor(endTime),
          metadata: {
            type,
            platform: project.platform,
            preset: project.preset
          }
        }
      });
    });

    // Step 3: Generate subtitle file
    const subtitlePath = await step.run('generate-subtitles', async () => {
      if (!project.transcription) {
        return null;
      }

      const tempDir = '/tmp/subtitles';
      await fs.mkdir(tempDir, { recursive: true });

      const subtitleSegments = extractSubtitleSegments(
        project.transcription.segments as any[],
        startTime,
        endTime
      );

      const subtitlePath = path.join(tempDir, `${clipRecord.id}.ass`);
      
      // Choose subtitle style based on platform
      let preset: SubtitlePreset = 'bold';
      if (project.platform === 'tiktok') {
        preset = 'tiktok';
      } else if (project.platform === 'youtube') {
        preset = 'youtube';
      }

      await generateASS(subtitleSegments, subtitlePath, preset);
      
      return subtitlePath;
    });

    // Step 4: Generate the video clip
    const clipData = await step.run('generate-video-clip', async () => {
      const tempDir = '/tmp/clips';
      await fs.mkdir(tempDir, { recursive: true });

      const outputPath = path.join(tempDir, `${clipRecord.id}.mp4`);
      const thumbnailPath = path.join(tempDir, `${clipRecord.id}_thumb.jpg`);

      // Determine resolution based on platform
      let resolution = '1080x1920'; // Default vertical for shorts
      if (project.platform === 'all') {
        resolution = '1080x1920';
      }

      const duration = endTime - startTime;

      // Generate clip with FFmpeg
      await new Promise<void>((resolve, reject) => {
        let command = ffmpeg(project.fileUrl!)
          .setStartTime(startTime)
          .setDuration(duration)
          .size(resolution)
          .videoCodec('libx264')
          .audioCodec('aac')
          .audioBitrate('128k')
          .videoBitrate('5000k')
          .fps(30)
          .outputOptions([
            '-preset fast',
            '-crf 23',
            '-movflags +faststart',
            '-pix_fmt yuv420p'
          ]);

        // Add subtitles if available
        if (subtitlePath) {
          command = command.outputOptions([
            `-vf subtitles=${subtitlePath}:force_style='FontSize=28,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=3'`
          ]);
        }

        command
          .output(outputPath)
          .on('start', (cmd) => console.log('FFmpeg:', cmd))
          .on('progress', (progress) => {
            console.log(`Progress: ${progress.percent?.toFixed(2)}%`);
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      });

      // Generate thumbnail
      await new Promise<void>((resolve, reject) => {
        ffmpeg(outputPath)
          .screenshots({
            timestamps: [duration / 2],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '1080x1920'
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });

      return { outputPath, thumbnailPath };
    });

    // Step 5: Upload to Vercel Blob
    const uploadedUrls = await step.run('upload-to-storage', async () => {
      const [videoBuffer, thumbnailBuffer] = await Promise.all([
        fs.readFile(clipData.outputPath),
        fs.readFile(clipData.thumbnailPath)
      ]);

      const [videoBlob, thumbnailBlob] = await Promise.all([
        put(`clips/${clipRecord.id}.mp4`, videoBuffer, {
          access: 'public',
          addRandomSuffix: false
        }),
        put(`clips/${clipRecord.id}_thumb.jpg`, thumbnailBuffer, {
          access: 'public',
          addRandomSuffix: false
        })
      ]);

      return {
        videoUrl: videoBlob.url,
        thumbnailUrl: thumbnailBlob.url
      };
    });

    // Step 6: Update clip record with URLs
    await step.run('update-clip-record', async () => {
      const stats = await fs.stat(clipData.outputPath);

      await db.clip.update({
        where: { id: clipRecord.id },
        data: {
          url: uploadedUrls.videoUrl,
          thumbnailUrl: uploadedUrls.thumbnailUrl,
          status: 'READY',
          duration: Math.floor(endTime - startTime),
          fileSize: stats.size,
          processedAt: new Date()
        }
      });
    });

    // Step 7: Cleanup temp files
    await step.run('cleanup', async () => {
      await Promise.all([
        fs.unlink(clipData.outputPath).catch(() => {}),
        fs.unlink(clipData.thumbnailPath).catch(() => {}),
        subtitlePath ? fs.unlink(subtitlePath).catch(() => {}) : Promise.resolve()
      ]);
    });

    // Step 8: Update project clip count
    await step.run('update-project-stats', async () => {
      const clipCount = await db.clip.count({
        where: { 
          projectId,
          status: 'READY'
        }
      });

      await db.project.update({
        where: { id: projectId },
        data: {
          metadata: {
            ...(project.metadata as any || {}),
            clipsGenerated: clipCount
          }
        }
      });
    });

    return {
      success: true,
      clipId: clipRecord.id,
      videoUrl: uploadedUrls.videoUrl,
      thumbnailUrl: uploadedUrls.thumbnailUrl
    };
  }
);


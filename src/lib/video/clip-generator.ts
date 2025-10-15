import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import type { ViralMoment } from "../ai/video-analyzer";

const execAsync = promisify(exec);

export interface GeneratedClip {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  viralScore: number;
  startTime: number;
  endTime: number;
  captions?: string;
  tags: string[];
  effects?: string[];
}

export interface ClipGenerationOptions {
  outputFormat: "mp4" | "webm";
  resolution: "1080x1920" | "1920x1080" | "720x1280";
  addCaptions?: boolean;
  addEffects?: boolean;
}

/**
 * Generate video clips from viral moments
 */
export async function generateClips(
  videoPath: string,
  moments: ViralMoment[],
  options: ClipGenerationOptions
): Promise<GeneratedClip[]> {
  const outputDir = "/tmp/clips";
  await fs.mkdir(outputDir, { recursive: true });

  const clips: GeneratedClip[] = [];

  for (let i = 0; i < moments.length; i++) {
    const moment = moments[i]!;
    const clipId = `clip_${Date.now()}_${i}`;
    const outputPath = path.join(outputDir, `${clipId}.${options.outputFormat}`);
    const thumbnailPath = path.join(outputDir, `${clipId}_thumb.jpg`);

    try {
      // Generate clip
      await generateClip(videoPath, moment, outputPath, options);

      // Generate thumbnail
      await generateThumbnail(outputPath, thumbnailPath, moment.startTime);

      clips.push({
        id: clipId,
        title: moment.title,
        description: moment.description,
        url: outputPath,
        thumbnail: thumbnailPath,
        duration: moment.endTime - moment.startTime,
        viralScore: moment.viralScore,
        startTime: moment.startTime,
        endTime: moment.endTime,
        captions: moment.captions,
        tags: moment.tags,
        effects: moment.effects,
      });
    } catch (error) {
      console.error(`Failed to generate clip ${i}:`, error);
    }
  }

  return clips;
}

/**
 * Generate a single clip from video
 */
async function generateClip(
  videoPath: string,
  moment: ViralMoment,
  outputPath: string,
  options: ClipGenerationOptions
): Promise<void> {
  const duration = moment.endTime - moment.startTime;
  const [width, height] = options.resolution.split("x").map(Number);

  let ffmpegCommand = `ffmpeg -i "${videoPath}" -ss ${moment.startTime} -t ${duration}`;

  // Scale and crop to target resolution
  ffmpegCommand += ` -vf "scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}"`;

  // Add effects if requested
  if (options.addEffects && moment.effects) {
    for (const effect of moment.effects) {
      if (effect === "slow-mo") {
        ffmpegCommand += ` -filter:v "setpts=2*PTS"`;
      } else if (effect === "zoom") {
        ffmpegCommand += ` -filter:v "zoompan=z='min(zoom+0.0015,1.5)':d=125"`;
      }
    }
  }

  // Output settings
  ffmpegCommand += ` -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${outputPath}"`;

  await execAsync(ffmpegCommand);
}

/**
 * Generate thumbnail from video
 */
async function generateThumbnail(
  videoPath: string,
  thumbnailPath: string,
  timestamp: number
): Promise<void> {
  const command = `ffmpeg -i "${videoPath}" -ss ${timestamp} -vframes 1 -vf "scale=640:360" "${thumbnailPath}"`;
  await execAsync(command);
}

/**
 * Add captions to video
 */
export async function addCaptionsToClip(
  clipPath: string,
  captions: string,
  outputPath: string
): Promise<void> {
  // Create SRT file
  const srtPath = clipPath.replace(/\.[^.]+$/, ".srt");
  await fs.writeFile(srtPath, captions);

  // Burn captions into video
  const command = `ffmpeg -i "${clipPath}" -vf "subtitles=${srtPath}:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'" -c:a copy "${outputPath}"`;
  
  await execAsync(command);
}

/**
 * Batch process multiple clips in parallel
 */
export async function generateClipsBatch(
  videoPath: string,
  moments: ViralMoment[],
  options: ClipGenerationOptions,
  concurrency: number = 3
): Promise<GeneratedClip[]> {
  const chunks: ViralMoment[][] = [];
  
  for (let i = 0; i < moments.length; i += concurrency) {
    chunks.push(moments.slice(i, i + concurrency));
  }

  const allClips: GeneratedClip[] = [];

  for (const chunk of chunks) {
    const clipPromises = chunk.map((moment, index) => {
      const globalIndex = allClips.length + index;
      return generateSingleClipWithRetry(videoPath, moment, globalIndex, options);
    });

    const clips = await Promise.all(clipPromises);
    allClips.push(...clips.filter((c): c is GeneratedClip => c !== null));
  }

  return allClips;
}

/**
 * Generate single clip with retry logic
 */
async function generateSingleClipWithRetry(
  videoPath: string,
  moment: ViralMoment,
  index: number,
  options: ClipGenerationOptions,
  maxRetries: number = 3
): Promise<GeneratedClip | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const outputDir = "/tmp/clips";
      const clipId = `clip_${Date.now()}_${index}`;
      const outputPath = path.join(outputDir, `${clipId}.${options.outputFormat}`);
      const thumbnailPath = path.join(outputDir, `${clipId}_thumb.jpg`);

      await generateClip(videoPath, moment, outputPath, options);
      await generateThumbnail(outputPath, thumbnailPath, moment.startTime);

      return {
        id: clipId,
        title: moment.title,
        description: moment.description,
        url: outputPath,
        thumbnail: thumbnailPath,
        duration: moment.endTime - moment.startTime,
        viralScore: moment.viralScore,
        startTime: moment.startTime,
        endTime: moment.endTime,
        captions: moment.captions,
        tags: moment.tags,
        effects: moment.effects,
      };
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for clip ${index}:`, error);
      if (attempt === maxRetries - 1) {
        return null;
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return null;
}


import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

const execAsync = promisify(exec);

export interface YouTubeVideoInfo {
  title: string;
  duration: number;
  thumbnail: string;
  description: string;
}

/**
 * Download a YouTube video using yt-dlp
 * @param url YouTube video URL
 * @returns Path to the downloaded video file
 */
export async function downloadYouTubeVideo(url: string): Promise<string> {
  const outputDir = "/tmp/videos";
  const outputTemplate = path.join(outputDir, "%(id)s.%(ext)s");

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  try {
    // Download video with yt-dlp (fallback to youtube-dl)
    const command = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputTemplate}" "${url}"`;
    
    const { stdout } = await execAsync(command);
    
    // Extract the output file path from stdout
    const match = stdout.match(/\[download\] Destination: (.+)/);
    if (!match) {
      throw new Error("Could not determine output file path");
    }

    return match[1]!.trim();
  } catch (error: any) {
    // If yt-dlp is not available, try youtube-dl
    try {
      const fallbackCommand = `youtube-dl -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputTemplate}" "${url}"`;
      const { stdout } = await execAsync(fallbackCommand);
      
      const match = stdout.match(/\[download\] Destination: (.+)/);
      if (!match) {
        throw new Error("Could not determine output file path");
      }

      return match[1]!.trim();
    } catch (fallbackError) {
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }
}

/**
 * Get video information without downloading
 * @param url YouTube video URL
 * @returns Video metadata
 */
export async function getYouTubeVideoInfo(url: string): Promise<YouTubeVideoInfo> {
  try {
    const command = `yt-dlp -j "${url}"`;
    const { stdout } = await execAsync(command);
    
    const info = JSON.parse(stdout);
    
    return {
      title: info.title || "Untitled",
      duration: info.duration || 0,
      thumbnail: info.thumbnail || "",
      description: info.description || "",
    };
  } catch (error: any) {
    // Fallback to youtube-dl
    try {
      const fallbackCommand = `youtube-dl -j "${url}"`;
      const { stdout } = await execAsync(fallbackCommand);
      
      const info = JSON.parse(stdout);
      
      return {
        title: info.title || "Untitled",
        duration: info.duration || 0,
        thumbnail: info.thumbnail || "",
        description: info.description || "",
      };
    } catch (fallbackError) {
      throw new Error(`Failed to get video info: ${error.message}`);
    }
  }
}

/**
 * Extract audio from video for transcription
 * @param videoPath Path to video file
 * @returns Path to extracted audio file
 */
export async function extractAudio(videoPath: string): Promise<string> {
  const audioPath = videoPath.replace(/\.[^.]+$/, ".mp3");
  
  const command = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}"`;
  
  await execAsync(command);
  
  return audioPath;
}


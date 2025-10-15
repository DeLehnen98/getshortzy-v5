import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { CodeInterpreter } from "@e2b/code-interpreter";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ProcessVideoOptions {
  videoPath: string;
  preset: "viral" | "balanced" | "volume";
  platform: "tiktok" | "youtube" | "instagram" | "all";
}

interface GeneratedClip {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  viralScore: number;
  metadata: Record<string, any>;
}

export async function processVideoWithAI(
  options: ProcessVideoOptions
): Promise<GeneratedClip[]> {
  const { videoPath, preset, platform } = options;

  // Step 1: Analyze video with AI
  const analysis = await analyzeVideoContent(videoPath);

  // Step 2: Generate clip timestamps based on preset
  const clipTimestamps = await generateClipTimestamps({
    analysis,
    preset,
    platform,
  });

  // Step 3: Extract clips using E2B sandbox
  const clips = await extractClips(videoPath, clipTimestamps);

  // Step 4: Calculate viral scores
  const clipsWithScores = await calculateViralScores(clips, analysis);

  return clipsWithScores;
}

async function analyzeVideoContent(videoPath: string) {
  // Use OpenAI to analyze video content
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this video and identify the most engaging moments, hooks, and viral-worthy segments. Provide timestamps and reasons.",
          },
          {
            type: "image_url",
            image_url: {
              url: `file://${videoPath}`,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}

async function generateClipTimestamps(options: {
  analysis: string;
  preset: string;
  platform: string;
}) {
  const { analysis, preset, platform } = options;

  const presetConfig = {
    viral: { count: 5, minScore: 85 },
    balanced: { count: 10, minScore: 70 },
    volume: { count: 20, minScore: 60 },
  };

  const config = presetConfig[preset as keyof typeof presetConfig];

  // Use Claude to generate optimal clip timestamps
  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Based on this video analysis:

${analysis}

Generate ${config.count} optimal clip timestamps for ${platform} platform.
Each clip should:
- Be 15-60 seconds long
- Have a strong hook in the first 3 seconds
- Be optimized for ${platform}
- Have viral potential score above ${config.minScore}

Return as JSON array with: startTime, endTime, title, description, viralScore`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return JSON.parse(content.text);
  }

  return [];
}

async function extractClips(
  videoPath: string,
  timestamps: any[]
): Promise<GeneratedClip[]> {
  // Use E2B sandbox to run FFmpeg
  const sandbox = await CodeInterpreter.create();

  const clips: GeneratedClip[] = [];

  for (const [index, timestamp] of timestamps.entries()) {
    // Upload video to sandbox
    await sandbox.uploadFile(videoPath, "/tmp/input.mp4");

    // Run FFmpeg to extract clip
    const result = await sandbox.runCode(`
import subprocess
import json

# Extract clip
subprocess.run([
    'ffmpeg',
    '-i', '/tmp/input.mp4',
    '-ss', '${timestamp.startTime}',
    '-to', '${timestamp.endTime}',
    '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-y',
    f'/tmp/clip_{index}.mp4'
])

# Generate thumbnail
subprocess.run([
    'ffmpeg',
    '-i', f'/tmp/clip_{index}.mp4',
    '-ss', '00:00:01',
    '-vframes', '1',
    '-y',
    f'/tmp/thumb_{index}.jpg'
])

print(json.dumps({'success': True}))
`);

    // Download clip and thumbnail
    const clipFile = await sandbox.downloadFile(`/tmp/clip_${index}.mp4`);
    const thumbFile = await sandbox.downloadFile(`/tmp/thumb_${index}.jpg`);

    // Upload to storage (implement your storage logic)
    const clipUrl = await uploadToStorage(clipFile, `clip_${index}.mp4`);
    const thumbUrl = await uploadToStorage(thumbFile, `thumb_${index}.jpg`);

    clips.push({
      title: timestamp.title,
      description: timestamp.description,
      url: clipUrl,
      thumbnailUrl: thumbUrl,
      duration: timestamp.endTime - timestamp.startTime,
      viralScore: timestamp.viralScore,
      metadata: {
        startTime: timestamp.startTime,
        endTime: timestamp.endTime,
      },
    });
  }

  await sandbox.close();

  return clips;
}

async function calculateViralScores(
  clips: GeneratedClip[],
  analysis: string
): Promise<GeneratedClip[]> {
  // Use AI to calculate viral scores based on content analysis
  for (const clip of clips) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Rate the viral potential of this clip (0-100):
Title: ${clip.title}
Description: ${clip.description}
Duration: ${clip.duration}s

Context: ${analysis}

Consider: hook strength, pacing, emotional impact, trending potential.
Return only the score number.`,
        },
      ],
    });

    const score = parseInt(
      response.choices[0]?.message.content || "50",
      10
    );
    clip.viralScore = Math.max(0, Math.min(100, score));
  }

  return clips.sort((a, b) => b.viralScore - a.viralScore);
}

async function uploadToStorage(
  file: Uint8Array,
  filename: string
): Promise<string> {
  // Implement your storage logic (S3, R2, etc.)
  // For now, return a placeholder
  return `https://storage.getshortzy.com/${filename}`;
}


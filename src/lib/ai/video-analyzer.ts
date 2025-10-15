import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { extractAudio } from "../video/youtube-downloader";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || "" 
});

export interface ViralMoment {
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  viralScore: number;
  tags: string[];
  reasoning: string;
  captions?: string;
  effects?: string[];
}

export interface VideoAnalysis {
  moments: ViralMoment[];
  overallScore: number;
  recommendations: string[];
  transcript?: string;
}

/**
 * Analyze video and identify viral moments using AI
 */
export async function analyzeVideoWithAI(
  videoPath: string,
  options: {
    platform: "tiktok" | "youtube" | "instagram" | "all";
    duration: number;
  }
): Promise<VideoAnalysis> {
  // Step 1: Extract audio and get transcript
  const audioPath = await extractAudio(videoPath);
  const transcript = await transcribeAudio(audioPath);

  // Step 2: Analyze with GPT-4o
  const gptAnalysis = await analyzeWithGPT4(transcript, options);

  // Step 3: Cross-validate with Claude (optional, for higher quality)
  const claudeAnalysis = await analyzeWithClaude(transcript, options);

  // Step 4: Merge and rank moments
  const moments = mergeAnalyses(gptAnalysis, claudeAnalysis);

  return {
    moments,
    overallScore: calculateOverallScore(moments),
    recommendations: generateRecommendations(moments, options.platform),
    transcript,
  };
}

/**
 * Transcribe audio using Whisper API
 */
async function transcribeAudio(audioPath: string): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: await fetch(`file://${audioPath}`).then(r => r.blob()) as any,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    return transcription.text || "";
  } catch (error) {
    console.error("Transcription failed:", error);
    return "";
  }
}

/**
 * Analyze transcript with GPT-4o
 */
async function analyzeWithGPT4(
  transcript: string,
  options: { platform: string; duration: number }
): Promise<ViralMoment[]> {
  const prompt = `You are an expert viral content strategist. Analyze this video transcript and identify the most engaging moments for ${options.platform}.

Transcript:
${transcript}

For each viral moment, provide:
1. Start and end timestamps (in seconds)
2. A catchy title (max 60 characters)
3. Brief description
4. Viral score (0-100)
5. Relevant hashtags/tags
6. Reasoning for why this moment is viral
7. Suggested captions
8. Recommended effects (zoom, slow-mo, etc.)

Target clip duration: ${options.duration} seconds
Platform: ${options.platform}

Return a JSON array of moments, sorted by viral score (highest first).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a viral content expert. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.moments || [];
  } catch (error) {
    console.error("GPT-4 analysis failed:", error);
    return [];
  }
}

/**
 * Analyze transcript with Claude
 */
async function analyzeWithClaude(
  transcript: string,
  options: { platform: string; duration: number }
): Promise<ViralMoment[]> {
  const prompt = `Analyze this video transcript and identify viral moments for ${options.platform}.

Transcript:
${transcript}

Identify the top 5-10 most engaging moments. For each moment:
- Start/end time (seconds)
- Title
- Description
- Viral score (0-100)
- Tags
- Why it's viral

Target duration: ${options.duration}s
Format: JSON array`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") return [];

    // Extract JSON from response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Claude analysis failed:", error);
    return [];
  }
}

/**
 * Merge and deduplicate analyses from multiple AI models
 */
function mergeAnalyses(
  gptMoments: ViralMoment[],
  claudeMoments: ViralMoment[]
): ViralMoment[] {
  const allMoments = [...gptMoments, ...claudeMoments];
  
  // Deduplicate based on time overlap
  const uniqueMoments: ViralMoment[] = [];
  
  for (const moment of allMoments) {
    const overlapping = uniqueMoments.find(
      (m) =>
        Math.abs(m.startTime - moment.startTime) < 5 &&
        Math.abs(m.endTime - moment.endTime) < 5
    );

    if (overlapping) {
      // Merge scores (average)
      overlapping.viralScore = (overlapping.viralScore + moment.viralScore) / 2;
      overlapping.tags = [...new Set([...overlapping.tags, ...moment.tags])];
    } else {
      uniqueMoments.push(moment);
    }
  }

  // Sort by viral score
  return uniqueMoments.sort((a, b) => b.viralScore - a.viralScore);
}

/**
 * Calculate overall video viral potential
 */
function calculateOverallScore(moments: ViralMoment[]): number {
  if (moments.length === 0) return 0;
  
  const avgScore = moments.reduce((sum, m) => sum + m.viralScore, 0) / moments.length;
  const topScore = moments[0]?.viralScore || 0;
  
  // Weighted average: 70% top score, 30% average
  return Math.round(topScore * 0.7 + avgScore * 0.3);
}

/**
 * Generate platform-specific recommendations
 */
function generateRecommendations(
  moments: ViralMoment[],
  platform: string
): string[] {
  const recommendations: string[] = [];

  if (moments.length === 0) {
    recommendations.push("No viral moments detected. Consider adding more engaging content.");
    return recommendations;
  }

  const topMoment = moments[0]!;
  
  recommendations.push(
    `Focus on the moment at ${topMoment.startTime}s - it has a viral score of ${topMoment.viralScore}`
  );

  if (platform === "tiktok") {
    recommendations.push("Add trending sounds and use popular hashtags");
    recommendations.push("Keep clips under 60 seconds for maximum engagement");
  } else if (platform === "youtube") {
    recommendations.push("Create a compelling thumbnail from the top moment");
    recommendations.push("Use chapters to highlight key moments");
  } else if (platform === "instagram") {
    recommendations.push("Optimize for vertical 9:16 format");
    recommendations.push("Add text overlays for sound-off viewing");
  }

  if (moments.length > 5) {
    recommendations.push(`You have ${moments.length} viral moments - consider creating a series`);
  }

  return recommendations;
}


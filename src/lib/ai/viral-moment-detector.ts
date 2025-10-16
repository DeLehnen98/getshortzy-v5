import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ViralMoment {
  startTime: number;
  endTime: number;
  score: number; // 0-100
  type: "story" | "question" | "hook" | "punchline" | "insight";
  description: string;
  transcript: string;
  reasoning: string;
  tags: string[];
}

export interface ViralMomentAnalysis {
  moments: ViralMoment[];
  overallScore: number;
  recommendations: string[];
  summary: string;
}

/**
 * Analyze transcript and detect viral moments using Gemini AI
 */
export async function detectViralMoments(
  transcript: string,
  segments: any[],
  options: {
    platform: "tiktok" | "youtube" | "instagram" | "all";
    targetDuration: number; // in seconds
    minScore?: number; // minimum viral score (default: 60)
  }
): Promise<ViralMomentAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are an expert social media content analyst specializing in viral short-form content for ${options.platform}.

Analyze the following video transcript and identify the most viral-worthy moments that would perform well as ${options.targetDuration}-second clips.

TRANSCRIPT WITH TIMESTAMPS:
${formatTranscriptWithTimestamps(segments)}

FULL TRANSCRIPT:
${transcript}

ANALYSIS CRITERIA:
1. **Hook Quality**: Does it grab attention in the first 2 seconds?
2. **Emotional Impact**: Does it evoke strong emotions (surprise, humor, inspiration, shock)?
3. **Shareability**: Would people want to share this with friends?
4. **Retention**: Does it keep viewers watching until the end?
5. **Platform Fit**: Does it match ${options.platform} trends and formats?
6. **Completeness**: Is it a self-contained story/moment?

VIRAL MOMENT TYPES:
- **hook**: Attention-grabbing opening (first 3-5 seconds)
- **story**: Complete mini-story with beginning, middle, end
- **question**: Thought-provoking question or mystery
- **punchline**: Joke, reveal, or unexpected twist
- **insight**: Valuable tip, fact, or "aha" moment

REQUIREMENTS:
- Each moment should be ${options.targetDuration}±10 seconds
- Minimum viral score: ${options.minScore || 60}/100
- Include exact start and end times from the transcript
- Provide clear reasoning for each score
- Suggest relevant hashtags/tags

Return your analysis in the following JSON format:
{
  "moments": [
    {
      "startTime": 0,
      "endTime": 30,
      "score": 85,
      "type": "hook",
      "description": "Brief description of the moment",
      "transcript": "Exact transcript text for this moment",
      "reasoning": "Why this would go viral",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ],
  "overallScore": 75,
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "summary": "Overall assessment of viral potential"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const analysis = JSON.parse(jsonText) as ViralMomentAnalysis;

    // Validate and filter moments
    analysis.moments = analysis.moments
      .filter((m) => m.score >= (options.minScore || 60))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 moments max

    return analysis;
  } catch (error) {
    console.error("Viral moment detection failed:", error);
    throw new Error(`Failed to detect viral moments: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Format transcript segments with timestamps for AI analysis
 */
function formatTranscriptWithTimestamps(segments: any[]): string {
  return segments
    .map((seg) => {
      const start = formatTime(seg.start || 0);
      const end = formatTime(seg.end || 0);
      const text = seg.text || "";
      return `[${start} - ${end}] ${text}`;
    })
    .join("\n");
}

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Analyze a single moment for viral potential
 */
export async function analyzeViralPotential(
  transcript: string,
  platform: string
): Promise<{ score: number; reasoning: string; improvements: string[] }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Rate the viral potential of this ${platform} clip on a scale of 0-100.

CLIP TRANSCRIPT:
${transcript}

Consider:
1. Hook strength (first 2 seconds)
2. Emotional impact
3. Shareability
4. Retention potential
5. Platform fit for ${platform}

Return JSON:
{
  "score": 0-100,
  "reasoning": "Why this score",
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Viral potential analysis failed:", error);
    return {
      score: 50,
      reasoning: "Analysis failed, using default score",
      improvements: [],
    };
  }
}


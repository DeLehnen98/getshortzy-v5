import { promises as fs } from 'fs';
import path from 'path';

export interface SubtitleSegment {
  start: number; // seconds
  end: number; // seconds
  text: string;
  speaker?: string;
}

export interface SubtitleStyle {
  fontName?: string;
  fontSize?: number;
  primaryColor?: string; // &HFFFFFF (white)
  outlineColor?: string; // &H000000 (black)
  outline?: number;
  shadow?: number;
  bold?: boolean;
  italic?: boolean;
  alignment?: number; // 1-9 (numpad positions)
  marginV?: number; // Vertical margin
  marginL?: number; // Left margin
  marginR?: number; // Right margin;
}

export type SubtitlePreset = 'minimal' | 'bold' | 'creative' | 'tiktok' | 'youtube';

/**
 * Predefined subtitle styles for different platforms
 */
const SUBTITLE_PRESETS: Record<SubtitlePreset, SubtitleStyle> = {
  minimal: {
    fontName: 'Arial',
    fontSize: 24,
    primaryColor: '&HFFFFFF',
    outlineColor: '&H000000',
    outline: 1,
    shadow: 0,
    bold: false,
    italic: false,
    alignment: 2, // Bottom center
    marginV: 20,
  },
  bold: {
    fontName: 'Impact',
    fontSize: 32,
    primaryColor: '&HFFFFFF',
    outlineColor: '&H000000',
    outline: 3,
    shadow: 2,
    bold: true,
    italic: false,
    alignment: 2,
    marginV: 30,
  },
  creative: {
    fontName: 'Montserrat',
    fontSize: 28,
    primaryColor: '&H00FFFF', // Yellow
    outlineColor: '&H000000',
    outline: 2,
    shadow: 1,
    bold: true,
    italic: false,
    alignment: 2,
    marginV: 25,
  },
  tiktok: {
    fontName: 'Proxima Nova',
    fontSize: 30,
    primaryColor: '&HFFFFFF',
    outlineColor: '&H000000',
    outline: 3,
    shadow: 0,
    bold: true,
    italic: false,
    alignment: 5, // Center
    marginV: 0,
  },
  youtube: {
    fontName: 'Roboto',
    fontSize: 26,
    primaryColor: '&HFFFFFF',
    outlineColor: '&H000000',
    outline: 2,
    shadow: 1,
    bold: false,
    italic: false,
    alignment: 2,
    marginV: 20,
  },
};

/**
 * Generate SRT subtitle file from segments
 */
export async function generateSRT(
  segments: SubtitleSegment[],
  outputPath: string
): Promise<string> {
  let srtContent = '';

  segments.forEach((segment, index) => {
    const startTime = formatSRTTime(segment.start);
    const endTime = formatSRTTime(segment.end);
    
    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${segment.text}\n\n`;
  });

  await fs.writeFile(outputPath, srtContent, 'utf-8');
  return outputPath;
}

/**
 * Generate ASS subtitle file with styling
 */
export async function generateASS(
  segments: SubtitleSegment[],
  outputPath: string,
  preset: SubtitlePreset = 'bold'
): Promise<string> {
  const style = SUBTITLE_PRESETS[preset];
  
  let assContent = `[Script Info]
Title: GetShortzy Subtitles
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${style.fontName},${style.fontSize},${style.primaryColor},&H000000FF,${style.outlineColor},&H00000000,${style.bold ? -1 : 0},${style.italic ? -1 : 0},0,0,100,100,0,0,1,${style.outline},${style.shadow},${style.alignment},${style.marginL || 10},${style.marginR || 10},${style.marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  segments.forEach((segment) => {
    const startTime = formatASSTime(segment.start);
    const endTime = formatASSTime(segment.end);
    const text = segment.text.replace(/\n/g, '\\N');
    
    assContent += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}\n`;
  });

  await fs.writeFile(outputPath, assContent, 'utf-8');
  return outputPath;
}

/**
 * Generate word-by-word subtitles for TikTok-style captions
 */
export async function generateWordByWordSubtitles(
  segments: SubtitleSegment[],
  outputPath: string,
  wordsPerSegment: number = 3
): Promise<string> {
  const wordSegments: SubtitleSegment[] = [];

  segments.forEach((segment) => {
    const words = segment.text.split(' ');
    const duration = segment.end - segment.start;
    const timePerWord = duration / words.length;

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      const start = segment.start + (i * timePerWord);
      const end = start + (segmentWords.length * timePerWord);

      wordSegments.push({
        start,
        end,
        text: segmentWords.join(' '),
        speaker: segment.speaker,
      });
    }
  });

  return generateASS(wordSegments, outputPath, 'tiktok');
}

/**
 * Generate animated subtitles with karaoke effect
 */
export async function generateKaraokeSubtitles(
  segments: SubtitleSegment[],
  outputPath: string
): Promise<string> {
  const style = SUBTITLE_PRESETS.creative;
  
  let assContent = `[Script Info]
Title: GetShortzy Karaoke Subtitles
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${style.fontName},${style.fontSize},${style.primaryColor},&H00FFFF00,${style.outlineColor},&H00000000,-1,0,0,0,100,100,0,0,1,3,0,5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  segments.forEach((segment) => {
    const startTime = formatASSTime(segment.start);
    const endTime = formatASSTime(segment.end);
    const duration = (segment.end - segment.start) * 100; // in centiseconds
    
    // Karaoke effect: text color changes as words are spoken
    const text = `{\\k${duration}}${segment.text}`;
    
    assContent += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,Karaoke,${text}\n`;
  });

  await fs.writeFile(outputPath, assContent, 'utf-8');
  return outputPath;
}

/**
 * Extract subtitle segments from transcription for a specific time range
 */
export function extractSubtitleSegments(
  transcriptionSegments: any[],
  startTime: number,
  endTime: number
): SubtitleSegment[] {
  return transcriptionSegments
    .filter((seg) => {
      const segStart = seg.start || 0;
      const segEnd = seg.end || 0;
      return segStart < endTime && segEnd > startTime;
    })
    .map((seg) => {
      const segStart = Math.max(seg.start || 0, startTime);
      const segEnd = Math.min(seg.end || 0, endTime);
      
      return {
        start: segStart - startTime, // Relative to clip start
        end: segEnd - startTime,
        text: seg.text || '',
        speaker: seg.speaker,
      };
    });
}

/**
 * Format time for SRT format (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(millis, 3)}`;
}

/**
 * Format time for ASS format (H:MM:SS.cc)
 */
function formatASSTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centisecs = Math.floor((seconds % 1) * 100);

  return `${hours}:${pad(minutes, 2)}:${pad(secs, 2)}.${pad(centisecs, 2)}`;
}

/**
 * Pad number with leading zeros
 */
function pad(num: number, size: number): string {
  return num.toString().padStart(size, '0');
}

/**
 * Split long text into multiple subtitle lines
 */
export function splitTextIntoLines(
  text: string,
  maxCharsPerLine: number = 42,
  maxLines: number = 2
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
      
      if (lines.length >= maxLines) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generate VTT subtitle file (for web players)
 */
export async function generateVTT(
  segments: SubtitleSegment[],
  outputPath: string
): Promise<string> {
  let vttContent = 'WEBVTT\n\n';

  segments.forEach((segment, index) => {
    const startTime = formatVTTTime(segment.start);
    const endTime = formatVTTTime(segment.end);
    
    vttContent += `${index + 1}\n`;
    vttContent += `${startTime} --> ${endTime}\n`;
    vttContent += `${segment.text}\n\n`;
  });

  await fs.writeFile(outputPath, vttContent, 'utf-8');
  return outputPath;
}

/**
 * Format time for VTT format (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}.${pad(millis, 3)}`;
}


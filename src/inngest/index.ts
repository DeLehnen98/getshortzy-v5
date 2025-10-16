import { transcribeVideo } from './transcribe';
import { analyzeViralMoments } from './analyze-viral-moments';
import { generateClip } from './generate-clip';

// Export all Inngest functions
export const functions = [
  transcribeVideo,
  analyzeViralMoments,
  generateClip
];


import { transcribeVideo } from './transcribe';
// import { analyzeViralMoments } from './analyze-viral-moments'; // Removed - depends on deleted AI lib
// import { generateClip } from './generate-clip'; // Disabled - requires Vercel Blob

// Export all Inngest functions
export const functions = [
  transcribeVideo,
  // analyzeViralMoments, // Removed - depends on deleted AI lib
  // generateClip // Disabled - requires Vercel Blob
];


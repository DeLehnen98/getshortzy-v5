import { inngest } from '@/lib/inngest';
import { db } from '@/lib/db';

export const transcribeVideo = inngest.createFunction(
  { id: 'transcribe-video' },
  { event: 'video/transcribe' },
  async ({ event, step }) => {
    const { projectId } = event.data;

    // Step 1: Extract audio
    const audioUrl = await step.run('extract-audio', async () => {
      const project = await db.project.findUnique({
        where: { id: projectId }
      });

      if (!project?.fileUrl) {
        throw new Error('No video URL found');
      }

      // Call audio extraction API
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/audio/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });

      if (!response.ok) {
        throw new Error('Audio extraction failed');
      }

      const data = await response.json();
      return data.audioUrl;
    });

    // Step 2: Transcribe with WhisperX
    const transcription = await step.run('transcribe-whisperx', async () => {
      // Call Python WhisperX service
      // For now, we'll use a placeholder - you'll need to set up the Python service
      const response = await fetch(`${process.env.WHISPERX_API_URL}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl,
          language: 'en',
          enableDiarization: true
        })
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      return await response.json();
    });

    // Step 3: Save transcription to database
    await step.run('save-transcription', async () => {
      await db.transcription.create({
        data: {
          projectId,
          text: transcription.text,
          segments: transcription.segments,
          language: transcription.language || 'en'
        }
      });

      // Update project status
      await db.project.update({
        where: { id: projectId },
        data: { 
          status: 'TRANSCRIBED',
          transcribedAt: new Date()
        }
      });
    });

    return { success: true, projectId };
  }
);


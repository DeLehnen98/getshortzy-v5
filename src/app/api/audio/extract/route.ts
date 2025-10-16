import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import ffmpeg from 'fluent-ffmpeg';
import { put } from '@vercel/blob';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await req.json();

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { user: true }
    });

    if (!project || project.user.clerkId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.fileUrl) {
      return NextResponse.json({ error: 'No video URL' }, { status: 400 });
    }

    // Create temporary file paths
    const tempId = randomUUID();
    const tempVideoPath = join(tmpdir(), `video-${tempId}.mp4`);
    const tempAudioPath = join(tmpdir(), `audio-${tempId}.wav`);

    try {
      // Download video to temp file
      const videoResponse = await fetch(project.fileUrl);
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
      writeFileSync(tempVideoPath, videoBuffer);

      // Extract audio using ffmpeg
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempVideoPath)
          .toFormat('wav')
          .audioChannels(1)
          .audioFrequency(16000)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .save(tempAudioPath);
      });

      // Upload audio to Vercel Blob
      const audioBuffer = require('fs').readFileSync(tempAudioPath);
      const audioBlob = await put(`audio/${projectId}.wav`, audioBuffer, {
        access: 'public',
        contentType: 'audio/wav',
      });

      // Update project with audio URL
      await db.project.update({
        where: { id: projectId },
        data: { 
          audioUrl: audioBlob.url,
          status: 'AUDIO_EXTRACTED'
        }
      });

      // Clean up temp files
      if (existsSync(tempVideoPath)) unlinkSync(tempVideoPath);
      if (existsSync(tempAudioPath)) unlinkSync(tempAudioPath);

      return NextResponse.json({
        success: true,
        audioUrl: audioBlob.url
      });

    } catch (error) {
      // Clean up temp files on error
      if (existsSync(tempVideoPath)) unlinkSync(tempVideoPath);
      if (existsSync(tempAudioPath)) unlinkSync(tempAudioPath);
      throw error;
    }

  } catch (error) {
    console.error('Audio extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract audio' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { inngest } from '@/lib/inngest';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Check user credits
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Extract video ID from URL
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    }

    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL' },
        { status: 400 }
      );
    }

    // Create project record
    const project = await db.project.create({
      data: {
        userId: user.id,
        name: `YouTube: ${videoId}`,
        sourceType: 'youtube',
        sourceUrl: url,
        status: 'pending',
        preset: 'viral',
        platform: 'all',
        transcriptionStatus: 'pending'
      }
    });

    // Create job for downloading YouTube video
    await db.job.create({
      data: {
        projectId: project.id,
        type: 'download',
        status: 'pending'
      }
    });

    // Trigger Inngest workflow to download and process
    await inngest.send({
      name: 'video/youtube.download',
      data: {
        projectId: project.id,
        youtubeUrl: url,
        videoId
      }
    });

    return NextResponse.json({
      projectId: project.id,
      message: 'YouTube video import started'
    });

  } catch (error) {
    console.error('YouTube import error:', error);
    return NextResponse.json(
      { error: 'Failed to import YouTube video' },
      { status: 500 }
    );
  }
}


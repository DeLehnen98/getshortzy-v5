import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { filename, contentType, size } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create project record
    const project = await db.project.create({
      data: {
        userId: user.id,
        name: filename,
        sourceType: 'upload',
        status: 'pending',
        preset: 'viral',
        platform: 'all',
        transcriptionStatus: 'pending'
      }
    });

    // Generate upload URL using Vercel Blob
    const blob = await put(`videos/${project.id}/${filename}`, new Blob(), {
      access: 'public',
      addRandomSuffix: false,
    });

    // Update project with file URL
    await db.project.update({
      where: { id: project.id },
      data: { fileUrl: blob.url }
    });

    return NextResponse.json({
      projectId: project.id,
      uploadUrl: blob.url
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate upload' },
      { status: 500 }
    );
  }
}


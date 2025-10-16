import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { inngest } from '@/lib/inngest';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get project and verify ownership
    const project = await db.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update project status
    await db.project.update({
      where: { id: projectId },
      data: {
        status: 'processing',
        transcriptionStatus: 'pending'
      }
    });

    // Create processing job
    await db.job.create({
      data: {
        projectId: project.id,
        type: 'process',
        status: 'pending'
      }
    });

    // Deduct credit
    await db.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1
        }
      }
    });

    // Log usage
    await db.usageLog.create({
      data: {
        userId: user.id,
        action: 'video_upload',
        credits: 1,
        metadata: {
          projectId: project.id,
          sourceType: project.sourceType
        }
      }
    });

    // Trigger Inngest workflow for processing
    await inngest.send({
      name: 'video/process.start',
      data: {
        projectId: project.id,
        fileUrl: project.fileUrl,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Upload complete, processing started'
    });

  } catch (error) {
    console.error('Upload completion error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}


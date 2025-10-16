import { inngest } from '@/lib/inngest';
import { db } from '@/lib/db';
import { detectViralMoments } from '@/lib/ai/viral-moment-detector';

export const analyzeViralMoments = inngest.createFunction(
  { 
    id: 'analyze-viral-moments',
    name: 'Analyze Viral Moments'
  },
  { event: 'video/analyze-viral-moments' },
  async ({ event, step }) => {
    const { projectId } = event.data;

    // Step 1: Get project and transcription
    const { project, transcription } = await step.run('fetch-data', async () => {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
          transcription: true
        }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      if (!project.transcription) {
        throw new Error('No transcription found for project');
      }

      return {
        project,
        transcription: project.transcription
      };
    });

    // Step 2: Update status
    await step.run('update-status-analyzing', async () => {
      await db.project.update({
        where: { id: projectId },
        data: { status: 'ANALYZING' }
      });
    });

    // Step 3: Detect viral moments with AI
    const analysis = await step.run('detect-viral-moments', async () => {
      const targetDuration = project.preset === 'viral' ? 30 : 
                            project.preset === 'balanced' ? 45 : 60;

      return await detectViralMoments(
        transcription.text,
        transcription.segments as any[],
        {
          platform: project.platform as any,
          targetDuration,
          minScore: 60
        }
      );
    });

    // Step 4: Save viral moments to database
    await step.run('save-viral-moments', async () => {
      // Delete existing viral moments for this project
      await db.viralMoment.deleteMany({
        where: { projectId }
      });

      // Create new viral moments
      const momentPromises = analysis.moments.map((moment) =>
        db.viralMoment.create({
          data: {
            projectId,
            startTime: Math.floor(moment.startTime),
            endTime: Math.floor(moment.endTime),
            score: moment.score,
            type: moment.type,
            description: moment.description,
            transcript: moment.transcript,
            metadata: {
              reasoning: moment.reasoning,
              tags: moment.tags,
              overallScore: analysis.overallScore,
              recommendations: analysis.recommendations
            }
          }
        })
      );

      await Promise.all(momentPromises);
    });

    // Step 5: Update project with analysis results
    await step.run('update-project-status', async () => {
      await db.project.update({
        where: { id: projectId },
        data: {
          status: 'ANALYZED',
          analyzedAt: new Date(),
          metadata: {
            viralScore: analysis.overallScore,
            totalMoments: analysis.moments.length,
            recommendations: analysis.recommendations,
            summary: analysis.summary
          }
        }
      });
    });

    // Step 6: Trigger clip generation for top moments
    const topMoments = analysis.moments.slice(0, 5); // Generate clips for top 5 moments
    
    for (const moment of topMoments) {
      await step.run(`trigger-clip-generation-${moment.startTime}`, async () => {
        await inngest.send({
          name: 'clip/generate',
          data: {
            projectId,
            startTime: moment.startTime,
            endTime: moment.endTime,
            title: moment.description,
            viralScore: moment.score,
            type: moment.type
          }
        });
      });
    }

    return {
      success: true,
      projectId,
      momentsFound: analysis.moments.length,
      overallScore: analysis.overallScore
    };
  }
);


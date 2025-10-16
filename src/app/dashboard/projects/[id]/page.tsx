'use client';

import { useParams } from 'next/navigation';
import { api } from '~/lib/trpc/client';
import TranscriptViewer from '@/components/TranscriptViewer';
import ViralMomentsViewer from '@/components/ViralMomentsViewer';
import ClipsViewer from '@/components/ClipsViewer';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Download, Sparkles } from 'lucide-react';

interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [currentTime, setCurrentTime] = useState(0);

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: transcription } = api.transcription.getByProjectId.useQuery({ projectId });

  const startTranscription = api.project.startTranscription.useMutation({
    onSuccess: () => {
      // Refresh data
      window.location.reload();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project not found</h2>
          <Link href="/dashboard" className="text-purple-500 hover:text-purple-400">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const transcriptSegments = (transcription?.segments as unknown as TranscriptSegment[]) || [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Status: <span className="text-purple-500">{project.status}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {!transcription && project.status === 'UPLOADED' && (
                <button
                  onClick={() => startTranscription.mutate({ projectId })}
                  disabled={startTranscription.isPending}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  {startTranscription.isPending ? 'Starting...' : 'Start Transcription'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Player */}
          <div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Video</h2>
              {project.fileUrl ? (
                <video
                  src={project.fileUrl}
                  controls
                  className="w-full rounded-lg"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
              ) : (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No video available</p>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Project Info</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Created:</span>
                  <p className="text-white">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                {project.transcribedAt && (
                  <div>
                    <span className="text-sm text-gray-400">Transcribed:</span>
                    <p className="text-white">{new Date(project.transcribedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transcript Viewer */}
          <div className="h-[calc(100vh-12rem)]">
            {transcription ? (
              <TranscriptViewer
                segments={transcriptSegments}
                currentTime={currentTime}
                onSeek={(time) => {
                  const video = document.querySelector('video');
                  if (video) video.currentTime = time;
                }}
              />
            ) : (
              <div className="h-full bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Transcript Yet</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Start transcription to see the transcript here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Viral Moments Section */}
        {transcription && (
          <div className="mt-8">
            <ViralMomentsViewer projectId={projectId} />
          </div>
        )}

        {/* Clips Section */}
        {transcription && (
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Generated Clips</h2>
              <p className="text-sm text-gray-400 mt-1">
                Download and share your viral clips
              </p>
            </div>
            <ClipsViewer projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  );
}


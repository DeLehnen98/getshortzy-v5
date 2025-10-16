"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/client";
import {
  Play,
  Download,
  Share2,
  Trash2,
  Clock,
  FileVideo,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Eye,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";

interface ClipsViewerProps {
  projectId: string;
}

export default function ClipsViewer({ projectId }: ClipsViewerProps) {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { data: clips, isLoading, refetch } = api.clip.getByProjectId.useQuery({
    projectId,
  });

  const deleteClipMutation = api.clip.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const copyToClipboard = async (url: string, clipId: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(clipId);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const downloadClip = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'PROCESSING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'FAILED':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm text-gray-400">Loading clips...</p>
        </div>
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-purple-500/10 p-4">
            <FileVideo className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Clips Generated Yet
            </h3>
            <p className="text-sm text-gray-400 max-w-md">
              Analyze your video for viral moments, then generate clips automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<FileVideo className="h-5 w-5" />}
          label="Total Clips"
          value={clips.length.toString()}
          color="purple"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Ready"
          value={clips.filter(c => c.status === 'READY').length.toString()}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Avg Score"
          value={Math.round(clips.reduce((sum, c) => sum + (c.viralScore || 0), 0) / clips.length).toString()}
          color="yellow"
        />
      </div>

      {/* Clips Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="group rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden transition-all hover:border-purple-500/50"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] bg-gray-950">
              {clip.thumbnailUrl ? (
                <img
                  src={clip.thumbnailUrl}
                  alt={clip.title || 'Clip thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileVideo className="h-12 w-12 text-gray-700" />
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {clip.status === 'READY' && clip.url && (
                  <>
                    <button
                      onClick={() => setSelectedClip(clip.id)}
                      className="rounded-full bg-purple-600 p-3 text-white hover:bg-purple-700 transition-colors"
                    >
                      <Play className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => downloadClip(clip.url!, `${clip.title}.mp4`)}
                      className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(clip.status)}`}>
                  {clip.status}
                </span>
              </div>

              {/* Viral Score */}
              {clip.viralScore && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span className={`text-xs font-bold ${getScoreColor(clip.viralScore)}`}>
                      {clip.viralScore}
                    </span>
                  </div>
                </div>
              )}

              {/* Duration */}
              {clip.duration && (
                <div className="absolute bottom-2 right-2">
                  <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1">
                    <Clock className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">
                      {formatDuration(clip.duration)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                {clip.title || 'Untitled Clip'}
              </h3>
              {clip.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                  {clip.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                {clip.fileSize && (
                  <span>{formatFileSize(clip.fileSize)}</span>
                )}
                {clip.processedAt && (
                  <span>{new Date(clip.processedAt).toLocaleDateString()}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {clip.status === 'READY' && clip.url && (
                  <>
                    <button
                      onClick={() => copyToClipboard(clip.url!, clip.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      {copiedUrl === clip.id ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy URL
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => window.open(clip.url!, '_blank')}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteClipMutation.mutate({ id: clip.id })}
                  disabled={deleteClipMutation.isPending}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedClip && (
        <VideoPlayerModal
          clip={clips.find(c => c.id === selectedClip)!}
          onClose={() => setSelectedClip(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg border p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function VideoPlayerModal({ clip, onClose }: { clip: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          <span className="text-2xl">×</span>
        </button>
        <div className="rounded-lg overflow-hidden bg-gray-900">
          <video
            src={clip.url}
            controls
            autoPlay
            className="w-full"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {clip.title}
            </h3>
            {clip.description && (
              <p className="text-sm text-gray-400">
                {clip.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


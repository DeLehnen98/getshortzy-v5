"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/client";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Tag,
  Play,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Zap,
  MessageSquare,
  Lightbulb,
  Laugh,
  BookOpen,
} from "lucide-react";

interface ViralMomentsViewerProps {
  projectId: string;
}

const momentTypeIcons = {
  hook: Zap,
  story: BookOpen,
  question: MessageSquare,
  punchline: Laugh,
  insight: Lightbulb,
};

const momentTypeColors = {
  hook: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  story: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  question: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  punchline: "text-pink-500 bg-pink-500/10 border-pink-500/20",
  insight: "text-green-500 bg-green-500/10 border-green-500/20",
};

export default function ViralMomentsViewer({ projectId }: ViralMomentsViewerProps) {
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);

  const { data: moments, isLoading, refetch } = api.viralMoments.getByProjectId.useQuery({
    projectId,
  });

  const { data: stats } = api.viralMoments.getStats.useQuery({ projectId });

  const analyzeMutation = api.viralMoments.analyzeProject.useMutation({
    onSuccess: () => {
      setTimeout(() => refetch(), 2000);
    },
  });

  const deleteMutation = api.viralMoments.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm text-gray-400">Loading viral moments...</p>
        </div>
      </div>
    );
  }

  if (!moments || moments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-purple-500/10 p-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Viral Moments Yet
            </h3>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Analyze your video to discover the most engaging moments that could go viral
              on social media.
            </p>
          </div>
          <button
            onClick={() => analyzeMutation.mutate({ projectId })}
            disabled={analyzeMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {analyzeMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Viral Moments
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Total Moments"
            value={stats.totalMoments.toString()}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Average Score"
            value={stats.averageScore.toString()}
            color="blue"
          />
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            label="Top Score"
            value={stats.topScore.toString()}
            color="yellow"
          />
          <StatCard
            icon={<Tag className="h-5 w-5" />}
            label="Types Found"
            value={Object.keys(stats.typeDistribution).length.toString()}
            color="green"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Viral Moments ({moments.length})
        </h3>
        <button
          onClick={() => analyzeMutation.mutate({ projectId })}
          disabled={analyzeMutation.isPending}
          className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${analyzeMutation.isPending ? "animate-spin" : ""}`} />
          Re-analyze
        </button>
      </div>

      {/* Moments Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {moments.map((moment) => {
          const Icon = momentTypeIcons[moment.type as keyof typeof momentTypeIcons];
          const colorClass = momentTypeColors[moment.type as keyof typeof momentTypeColors];

          return (
            <div
              key={moment.id}
              className={`group rounded-lg border bg-gray-900/50 p-4 transition-all hover:border-purple-500/50 ${
                selectedMoment === moment.id ? "border-purple-500" : "border-gray-800"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg border p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium uppercase ${colorClass.split(' ')[0]}`}>
                      {moment.type}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatTime(moment.startTime)} - {formatTime(moment.endTime)}
                      <span className="text-gray-600">•</span>
                      {moment.endTime - moment.startTime}s
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(moment.score)}`}>
                  {moment.score}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {moment.description}
              </p>

              {/* Transcript Preview */}
              {moment.transcript && (
                <div className="rounded-lg bg-gray-950/50 p-3 mb-3">
                  <p className="text-xs text-gray-400 line-clamp-3 italic">
                    "{moment.transcript}"
                  </p>
                </div>
              )}

              {/* Tags */}
              {moment.metadata && typeof moment.metadata === 'object' && 'tags' in moment.metadata && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(moment.metadata.tags as string[]).slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 transition-colors">
                  <Play className="h-3 w-3" />
                  Preview
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <Download className="h-3 w-3" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate({ id: moment.id })}
                  disabled={deleteMutation.isPending}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
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


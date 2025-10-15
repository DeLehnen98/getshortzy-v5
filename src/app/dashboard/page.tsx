"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Video,
  TrendingUp,
  Clock,
  Settings,
  CreditCard,
  BarChart3,
  Download,
  Share2,
  Trash2,
  Eye,
  PlayCircle,
  Youtube,
  Upload as UploadIcon,
  Link2,
  Zap,
} from "lucide-react";
import { api } from "~/lib/trpc/client";
import { useState } from "react";

export default function DashboardPage() {
  const { data: stats } = api.user.getStats.useQuery();
  const { data: projects } = api.project.list.useQuery();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">GetShortzy</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/analytics"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/dashboard/settings"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 shadow-lg shadow-purple-500/20">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">
                  {stats?.credits ?? 0} Credits
                </span>
              </div>
              <Link
                href="/dashboard/billing"
                className="rounded-lg border border-purple-500 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-colors"
              >
                <CreditCard className="h-4 w-4 inline mr-2" />
                Upgrade
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Create viral shorts from your videos in minutes
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            icon={<UploadIcon className="h-6 w-6 text-purple-500" />}
            title="Upload Video"
            description="Upload from your device"
            onClick={() => setShowUploadDialog(true)}
            gradient="from-purple-600 to-purple-800"
          />
          <QuickActionCard
            icon={<Youtube className="h-6 w-6 text-red-500" />}
            title="Import from YouTube"
            description="Paste a YouTube URL"
            onClick={() => setShowUploadDialog(true)}
            gradient="from-red-600 to-red-800"
          />
          <QuickActionCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="Batch Process"
            description="Process multiple videos"
            onClick={() => {}}
            gradient="from-yellow-600 to-yellow-800"
          />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Video className="h-6 w-6 text-purple-500" />}
            label="Total Projects"
            value={stats?.projectsCount ?? 0}
            change="+12%"
            changeType="positive"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            label="Clips Generated"
            value={stats?.clipsCount ?? 0}
            change="+23%"
            changeType="positive"
          />
          <StatCard
            icon={<Sparkles className="h-6 w-6 text-yellow-500" />}
            label="Credits Used"
            value={stats?.totalUsage ?? 0}
            change="-5%"
            changeType="negative"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-blue-500" />}
            label="Processing"
            value={
              projects?.filter((p) => p.status === "processing").length ?? 0
            }
            change="0%"
            changeType="neutral"
          />
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Your Projects
              </h2>
              <p className="text-sm text-gray-400">
                {projects?.length ?? 0} total projects
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-700 bg-gray-800 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>
              <button
                onClick={() => setShowUploadDialog(true)}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>

          {projects && projects.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-4"
              }
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreateClick={() => setShowUploadDialog(true)} />
          )}
        </div>

        {/* Tips Section */}
        <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Pro Tip: Maximize Your Viral Potential
              </h3>
              <p className="text-gray-400 mb-4">
                Upload videos with clear speech and strong hooks in the first 3
                seconds. Our AI performs best with content that has high energy
                and engaging moments.
              </p>
              <Link
                href="/blog/viral-tips"
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <UploadDialog onClose={() => setShowUploadDialog(false)} />
      )}
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  onClick,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 p-6 text-left transition-all hover:border-gray-700 hover:shadow-lg`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
      />
      <div className="relative">
        <div className="mb-3 inline-block rounded-lg bg-gray-800 p-3 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  changeType,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}) {
  const changeColors = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-gray-500",
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-lg bg-gray-800 p-3">{icon}</div>
        <span className={`text-sm font-medium ${changeColors[changeType]}`}>
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ProjectCard({
  project,
  viewMode,
}: {
  project: any;
  viewMode: "grid" | "list";
}) {
  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusIcons = {
    pending: <Clock className="h-3 w-3" />,
    processing: <Zap className="h-3 w-3 animate-pulse" />,
    completed: <TrendingUp className="h-3 w-3" />,
    failed: <Trash2 className="h-3 w-3" />,
  };

  if (viewMode === "list") {
    return (
      <div className="group rounded-xl border border-gray-800 bg-gray-900 p-4 transition-all hover:border-purple-500/50 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="rounded-lg bg-gray-800 p-3">
              <Video className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <span
                  className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                    statusColors[project.status as keyof typeof statusColors]
                  }`}
                >
                  {statusIcons[project.status as keyof typeof statusIcons]}
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-sm text-gray-400">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {project._count.clips} clips
              </p>
              <p className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-400 hover:text-white hover:border-purple-500 transition-colors">
                <Eye className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-400 hover:text-white hover:border-purple-500 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-gray-800 p-3 group-hover:bg-purple-500/10 transition-colors">
          <Video className="h-6 w-6 text-purple-500" />
        </div>
        <span
          className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
            statusColors[project.status as keyof typeof statusColors]
          }`}
        >
          {statusIcons[project.status as keyof typeof statusIcons]}
          {project.status}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
        {project.name}
      </h3>
      {project.description && (
        <p className="mb-4 text-sm text-gray-400 line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            {project._count.clips} clips
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
        <button className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:border-purple-500 transition-colors">
          <Download className="h-4 w-4 inline mr-1" />
          Download
        </button>
        <button className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
          View Details
        </button>
      </div>
    </Link>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
      <div className="mx-auto mb-4 rounded-full bg-gray-800 p-6 w-fit">
        <Video className="h-12 w-12 text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No projects yet
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Get started by creating your first project. Upload a video or import
        from YouTube to generate viral shorts automatically.
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
      >
        <Plus className="h-4 w-4" />
        Create Your First Project
      </button>
    </div>
  );
}

function UploadDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    sourceType: "youtube" as "youtube" | "upload",
    sourceUrl: "",
    preset: "viral" as "viral" | "balanced" | "volume",
    platform: "all" as "tiktok" | "youtube" | "instagram" | "all",
  });

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
  });

  const handleSubmit = () => {
    createProject.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Project</h2>
            <p className="text-sm text-gray-400 mt-1">
              Step {step} of 2 - {step === 1 ? "Video Source" : "Settings"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="My Awesome Video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Video Source
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setFormData({ ...formData, sourceType: "youtube" })
                  }
                  className={`group relative overflow-hidden rounded-lg border p-6 transition-all ${
                    formData.sourceType === "youtube"
                      ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                >
                  <Youtube className="h-8 w-8 text-red-500 mb-3" />
                  <p className="font-medium text-white mb-1">YouTube URL</p>
                  <p className="text-xs text-gray-400">
                    Import from YouTube
                  </p>
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, sourceType: "upload" })
                  }
                  className={`group relative overflow-hidden rounded-lg border p-6 transition-all ${
                    formData.sourceType === "upload"
                      ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                >
                  <UploadIcon className="h-8 w-8 text-purple-500 mb-3" />
                  <p className="font-medium text-white mb-1">Upload Video</p>
                  <p className="text-xs text-gray-400">From your device</p>
                </button>
              </div>
            </div>
            {formData.sourceType === "youtube" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube URL
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, sourceUrl: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.sourceUrl}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              Continue to Settings
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Quality Preset
              </label>
              <div className="space-y-3">
                {[
                  {
                    value: "viral",
                    label: "🔥 Viral Guarantee",
                    desc: "3-5 clips, 85+ viral score",
                    recommended: true,
                  },
                  {
                    value: "balanced",
                    label: "⚖️ Balanced Quality",
                    desc: "8-12 clips, 70+ viral score",
                  },
                  {
                    value: "volume",
                    label: "📊 Maximum Volume",
                    desc: "15-25 clips, 60+ viral score",
                  },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        preset: preset.value as any,
                      })
                    }
                    className={`relative w-full rounded-lg border p-4 text-left transition-all ${
                      formData.preset === preset.value
                        ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    {preset.recommended && (
                      <span className="absolute -top-2 right-4 rounded-full bg-purple-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Recommended
                      </span>
                    )}
                    <p className="font-medium text-white mb-1">
                      {preset.label}
                    </p>
                    <p className="text-sm text-gray-400">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Target Platform
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "tiktok", label: "TikTok", icon: "🎵" },
                  { value: "youtube", label: "YouTube", icon: "📺" },
                  { value: "instagram", label: "Instagram", icon: "📸" },
                  { value: "all", label: "All Platforms", icon: "🌐" },
                ].map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        platform: platform.value as any,
                      })
                    }
                    className={`rounded-lg border p-3 transition-all ${
                      formData.platform === platform.value
                        ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <p className="font-medium text-white">
                      {platform.icon} {platform.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-3 font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={createProject.isPending}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20"
              >
                {createProject.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 animate-pulse" />
                    Creating...
                  </span>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


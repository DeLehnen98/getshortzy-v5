'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Upload, Youtube, Zap, Video, TrendingUp, Clock, CreditCard } from "lucide-react";
import { api } from "~/lib/trpc/client";
import { useState } from "react";
import UploadModal from "@/components/UploadModal";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats } = api.user.getStats.useQuery();
  const { data: projects } = api.project.list.useQuery();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleUploadComplete = (projectId: string) => {
    setShowUploadDialog(false);
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Clean Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="h-7 w-7 text-purple-500 group-hover:text-purple-400 transition-colors" />
                <div className="absolute inset-0 blur-xl bg-purple-500/20 group-hover:bg-purple-400/30 transition-all" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                GetShortzy
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Credits */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">
                  {stats?.credits ?? 0}
                </span>
              </div>

              {/* Upgrade */}
              <Link
                href="/dashboard/billing"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-all text-sm font-medium text-white"
              >
                <CreditCard className="h-4 w-4" />
                Upgrade
              </Link>

              {/* User */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Create Viral Shorts
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your long videos into engaging short clips with AI
          </p>
        </div>

        {/* Upload CTA */}
        <div className="mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Upload Video */}
                <button
                  onClick={() => setShowUploadDialog(true)}
                  className="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-600/5 p-6 text-left transition-all hover:from-purple-600/30 hover:to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40"
                >
                  <Upload className="h-8 w-8 text-purple-400 mb-3 group-hover/card:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-1">Upload Video</h3>
                  <p className="text-sm text-gray-400">From your device</p>
                </button>

                {/* YouTube Import */}
                <button
                  onClick={() => setShowUploadDialog(true)}
                  className="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600/20 to-red-600/5 p-6 text-left transition-all hover:from-red-600/30 hover:to-red-600/10 border border-red-500/20 hover:border-red-500/40"
                >
                  <Youtube className="h-8 w-8 text-red-400 mb-3 group-hover/card:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-1">YouTube URL</h3>
                  <p className="text-sm text-gray-400">Paste a link</p>
                </button>

                {/* Batch Process */}
                <button
                  onClick={() => {}}
                  className="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 p-6 text-left transition-all hover:from-yellow-600/30 hover:to-yellow-600/10 border border-yellow-500/20 hover:border-yellow-500/40"
                >
                  <Zap className="h-8 w-8 text-yellow-400 mb-3 group-hover/card:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-1">Batch Process</h3>
                  <p className="text-sm text-gray-400">Multiple videos</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Video className="h-5 w-5" />}
            label="Projects"
            value={stats?.projectsCount ?? 0}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Clips"
            value={stats?.clipsCount ?? 0}
            color="green"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Credits Used"
            value={stats?.totalUsage ?? 0}
            color="yellow"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Processing"
            value={projects?.filter((p) => p.status === "processing").length ?? 0}
            color="blue"
          />
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
            {projects && projects.length > 0 && (
              <Link
                href="/dashboard/projects"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState onUploadClick={() => setShowUploadDialog(true)} />
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUploadComplete={handleUploadComplete}
      />
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
  value: number;
  color: "purple" | "green" | "yellow" | "blue";
}) {
  const colors = {
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
  };

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colors[color]} border p-6`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`${colors[color].split(' ')[3]}`}>{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const router = useRouter();

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <button
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 p-6 text-left transition-all hover:border-purple-500/30"
    >
      {/* Thumbnail or Placeholder */}
      <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
        <Video className="h-12 w-12 text-purple-400/50" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
        {project.title || "Untitled Project"}
      </h3>

      {/* Status */}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[project.status as keyof typeof statusColors]}`}>
          {project.status}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
        <Video className="h-8 w-8 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
      <p className="text-gray-400 mb-6 max-w-sm mx-auto">
        Upload your first video to start creating viral shorts with AI
      </p>
      <button
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition-all text-white font-medium"
      >
        <Upload className="h-5 w-5" />
        Upload Video
      </button>
    </div>
  );
}


"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Plus, Video, TrendingUp, Clock } from "lucide-react";
import { api } from "~/lib/trpc/client";
import { useState } from "react";

export default function DashboardPage() {
  const { data: stats } = api.user.getStats.useQuery();
  const { data: projects } = api.project.list.useQuery();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">GetShortzy</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-purple-600/20 px-4 py-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">
                  {stats?.credits ?? 0} Credits
                </span>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Video className="h-6 w-6 text-purple-500" />}
            label="Projects"
            value={stats?.projectsCount ?? 0}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            label="Clips Generated"
            value={stats?.clipsCount ?? 0}
          />
          <StatCard
            icon={<Sparkles className="h-6 w-6 text-yellow-500" />}
            label="Credits Used"
            value={stats?.totalUsage ?? 0}
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-blue-500" />}
            label="Processing"
            value={
              projects?.filter((p) => p.status === "processing").length ?? 0
            }
          />
        </div>

        {/* Projects */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <button
              onClick={() => setShowUploadDialog(true)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState onCreateClick={() => setShowUploadDialog(true)} />
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <UploadDialog onClose={() => setShowUploadDialog(false)} />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">{icon}</div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-purple-500"
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusColors[project.status as keyof typeof statusColors]
          }`}
        >
          {project.status}
        </span>
      </div>
      {project.description && (
        <p className="mb-4 text-sm text-gray-400">{project.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{project._count.clips} clips</span>
        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
      <Video className="mx-auto h-12 w-12 text-gray-600" />
      <h3 className="mt-4 text-lg font-semibold text-white">
        No projects yet
      </h3>
      <p className="mt-2 text-sm text-gray-400">
        Get started by creating your first project
      </p>
      <button
        onClick={onCreateClick}
        className="mt-6 flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 mx-auto"
      >
        <Plus className="h-4 w-4" />
        Create Project
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
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
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white"
                placeholder="My Awesome Video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setFormData({ ...formData, sourceType: "youtube" })
                  }
                  className={`rounded-lg border p-4 ${
                    formData.sourceType === "youtube"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-700 bg-gray-800"
                  }`}
                >
                  <p className="font-medium text-white">YouTube URL</p>
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, sourceType: "upload" })
                  }
                  className={`rounded-lg border p-4 ${
                    formData.sourceType === "upload"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-700 bg-gray-800"
                  }`}
                >
                  <p className="font-medium text-white">Upload Video</p>
                </button>
              </div>
            </div>
            {formData.sourceType === "youtube" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.sourceUrl}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preset
              </label>
              <div className="space-y-2">
                {[
                  { value: "viral", label: "🔥 Viral Guarantee", desc: "3-5 clips, 85+ score" },
                  { value: "balanced", label: "⚖️ Balanced Quality", desc: "8-12 clips, 70+ score" },
                  { value: "volume", label: "📊 Maximum Volume", desc: "15-25 clips, 60+ score" },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        preset: preset.value as any,
                      })
                    }
                    className={`w-full rounded-lg border p-4 text-left ${
                      formData.preset === preset.value
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <p className="font-medium text-white">{preset.label}</p>
                    <p className="text-sm text-gray-400">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "tiktok", label: "TikTok" },
                  { value: "youtube", label: "YouTube" },
                  { value: "instagram", label: "Instagram" },
                  { value: "all", label: "All Platforms" },
                ].map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        platform: platform.value as any,
                      })
                    }
                    className={`rounded-lg border p-3 ${
                      formData.platform === platform.value
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <p className="font-medium text-white">{platform.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-full rounded-lg border border-gray-700 px-4 py-3 font-medium text-white hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={createProject.isPending}
                className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {createProject.isPending ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


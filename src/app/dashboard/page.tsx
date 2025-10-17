"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Upload, Zap } from "lucide-react";
import { api } from "~/lib/trpc/client";

export default function DashboardPage() {
  const { data: stats } = api.user.getStats.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
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
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium transition-all"
              >
                <Zap className="h-4 w-4 inline mr-1" />
                Upgrade
              </Link>

              {/* User Button */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to GetShortzy
          </h1>
          <p className="text-xl text-gray-400">
            Your AI-powered video clip generator is being configured.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Credits</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.credits ?? 0}</p>
            <p className="text-sm text-gray-400 mt-1">Available credits</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Projects</h3>
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400 mt-1">Total projects</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Clips Generated</h3>
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400 mt-1">Total clips</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-12 text-center">
          <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Video Processing Features Coming Soon
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're currently setting up the video processing pipeline. Soon you'll be able to upload videos,
            generate viral clips, and share them across all your social media platforms.
          </p>
        </div>
      </main>
    </div>
  );
}


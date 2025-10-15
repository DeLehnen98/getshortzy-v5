import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">GetShortzy</span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Turn Long Videos Into
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Viral Shorts
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            AI-powered platform that analyzes your videos and generates
            high-performing short-form content for TikTok, YouTube Shorts, and
            Instagram Reels.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700">
                  Start Creating Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-purple-500" />}
            title="AI-Powered Analysis"
            description="GPT-4o and Claude analyze your videos to find the most engaging moments"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-500" />}
            title="Instant Processing"
            description="Cloud-based processing with E2B sandboxes for lightning-fast results"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-green-500" />}
            title="Viral Score"
            description="Each clip gets a viral potential score to help you choose the best content"
          />
        </div>

        {/* Stats */}
        <div className="mt-32 grid gap-8 sm:grid-cols-3">
          <StatCard number="10M+" label="Clips Generated" />
          <StatCard number="500K+" label="Happy Creators" />
          <StatCard number="2.5B+" label="Total Views" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 GetShortzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white">{number}</div>
      <div className="mt-2 text-gray-400">{label}</div>
    </div>
  );
}


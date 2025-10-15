import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Video,
  Scissors,
  Brain,
  Clock,
  Target,
  BarChart,
  CheckCircle,
  Star,
  Play,
  Upload,
  Wand2,
  Download,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">GetShortzy</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
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
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 mb-6 border border-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              AI-Powered Video Automation
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Turn Long Videos Into
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Viral Shorts
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            AI-powered platform that analyzes your videos and automatically generates
            high-performing short-form content for TikTok, YouTube Shorts, and
            Instagram Reels. No editing skills required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700 transition-all hover:scale-105 shadow-lg shadow-purple-500/50">
                  Start Creating Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700 transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </SignedIn>
            <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-all">
              <Play className="h-5 w-5" />
              Watch Demo
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>3 free credits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-sm font-medium text-gray-400 mb-8">
            Trusted by content creators worldwide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center opacity-50">
            <div className="text-2xl font-bold text-white">YouTube</div>
            <div className="text-2xl font-bold text-white">TikTok</div>
            <div className="text-2xl font-bold text-white">Instagram</div>
            <div className="text-2xl font-bold text-white">LinkedIn</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <StatCard number="10M+" label="Clips Generated" />
            <StatCard number="500K+" label="Happy Creators" />
            <StatCard number="2.5B+" label="Total Views Generated" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Go Viral
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Powerful AI features that transform your long-form content into
            engaging short videos that drive views and engagement.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-purple-500" />}
            title="AI-Powered Analysis"
            description="GPT-4o and Claude analyze your videos to identify the most engaging moments, hooks, and viral-worthy content automatically."
          />
          <FeatureCard
            icon={<Scissors className="h-8 w-8 text-blue-500" />}
            title="Smart Auto-Editing"
            description="Automatically cuts, crops, and optimizes your videos for each platform's specifications and best practices."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-500" />}
            title="Lightning Fast Processing"
            description="Cloud-based processing with E2B sandboxes delivers your clips in minutes, not hours. Scale to process hundreds of videos."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-green-500" />}
            title="Viral Score Prediction"
            description="Each clip gets an AI-calculated viral potential score based on engagement patterns, helping you choose the best content."
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-red-500" />}
            title="Platform Optimization"
            description="Automatically formats videos for TikTok, YouTube Shorts, Instagram Reels, and more with platform-specific optimizations."
          />
          <FeatureCard
            icon={<Wand2 className="h-8 w-8 text-pink-500" />}
            title="Auto Captions & Effects"
            description="Add trendy captions, animations, and effects automatically. Customize styles to match your brand."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              From Upload to Viral in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our AI does the heavy lifting so you can focus on creating great content.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <StepCard
              number="1"
              icon={<Upload className="h-12 w-12 text-purple-500" />}
              title="Upload Your Video"
              description="Drop your long-form video or paste a YouTube URL. We support all major video formats up to 4K resolution."
            />
            <StepCard
              number="2"
              icon={<Brain className="h-12 w-12 text-purple-500" />}
              title="AI Analyzes & Creates"
              description="Our AI identifies the best moments, creates multiple clips, adds captions, and optimizes for each platform."
            />
            <StepCard
              number="3"
              icon={<Download className="h-12 w-12 text-purple-500" />}
              title="Download & Publish"
              description="Review your clips with viral scores, make any tweaks, and download or publish directly to your platforms."
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Loved by Content Creators
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See what creators are saying about GetShortzy
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard
            quote="GetShortzy cut my editing time from 4 hours to 10 minutes. The AI knows exactly which moments will go viral. Game changer!"
            author="Sarah Chen"
            role="YouTube Creator, 2.5M subscribers"
            rating={5}
          />
          <TestimonialCard
            quote="I went from posting once a week to daily. The quality is incredible and the viral scores are surprisingly accurate."
            author="Marcus Johnson"
            role="TikTok Influencer, 1.2M followers"
          />
          <TestimonialCard
            quote="As a busy entrepreneur, this tool is a lifesaver. I can repurpose all my podcast episodes into shorts without hiring an editor."
            author="Emily Rodriguez"
            role="Podcast Host & Business Coach"
            rating={5}
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for trying out GetShortzy"
              features={[
                "3 free credits",
                "Up to 3 projects",
                "Basic AI analysis",
                "720p export quality",
                "Community support",
              ]}
              cta="Get Started"
              highlighted={false}
            />
            <PricingCard
              name="Creator"
              price="$29"
              period="/month"
              description="For serious content creators"
              features={[
                "50 credits/month",
                "Unlimited projects",
                "Advanced AI analysis",
                "4K export quality",
                "Priority processing",
                "Custom branding",
                "Email support",
              ]}
              cta="Start Free Trial"
              highlighted={true}
            />
            <PricingCard
              name="Agency"
              price="$99"
              period="/month"
              description="For teams and agencies"
              features={[
                "200 credits/month",
                "Team collaboration",
                "White-label options",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "24/7 priority support",
              ]}
              cta="Contact Sales"
              highlighted={false}
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about GetShortzy
          </p>
        </div>
        <div className="space-y-6">
          <FAQItem
            question="How does the AI know which clips will go viral?"
            answer="Our AI analyzes millions of viral videos across platforms to understand patterns in engagement, pacing, hooks, and content structure. It uses GPT-4o and Claude to identify moments with high viral potential based on these learned patterns."
          />
          <FAQItem
            question="What video formats do you support?"
            answer="We support all major video formats including MP4, MOV, AVI, MKV, and WebM. You can also directly import from YouTube by pasting a URL. Videos can be up to 4K resolution."
          />
          <FAQItem
            question="How long does processing take?"
            answer="Most videos are processed in 5-15 minutes depending on length and quality. Our cloud infrastructure scales automatically to handle peak loads, ensuring fast processing times."
          />
          <FAQItem
            question="Can I customize the clips after AI generation?"
            answer="Absolutely! While our AI does the heavy lifting, you have full control to trim clips, adjust captions, change styles, and customize every aspect before downloading."
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund, no questions asked."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Viral Content?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are growing their audience with AI-powered shorts.
            Start free, no credit card required.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-all hover:scale-105 shadow-xl mx-auto">
                Start Creating Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold text-white">GetShortzy</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered video automation for content creators.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
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
    <div className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-gray-900 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="mb-4 transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="mt-2 text-gray-400">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-purple-500/10 p-6 border border-purple-500/20">
          {icon}
        </div>
      </div>
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
}: {
  quote: string;
  author: string;
  role: string;
  rating?: number;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="mb-4 text-gray-300 italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-white">{author}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-8 ${
        highlighted
          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105"
          : "border-gray-800 bg-gray-900/50"
      }`}
    >
      {highlighted && (
        <div className="mb-4 inline-block rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-white">{price}</span>
        {period && <span className="text-gray-400">{period}</span>}
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className={`w-full rounded-lg px-4 py-3 font-semibold transition-colors ${
              highlighted
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {cta}
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className={`block w-full rounded-lg px-4 py-3 font-semibold text-center transition-colors ${
            highlighted
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {cta}
        </Link>
      </SignedIn>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <summary className="flex cursor-pointer items-center justify-between font-semibold text-white">
        {question}
        <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="mt-4 text-gray-400">{answer}</p>
    </details>
  );
}


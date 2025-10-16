"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/client";
import { AlertTriangle, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LowCreditsWarningProps {
  threshold?: number; // Show warning when credits fall below this number
}

export default function LowCreditsWarning({ threshold = 5 }: LowCreditsWarningProps) {
  const [dismissed, setDismissed] = useState(false);
  const { data: balance } = api.billing.getBalance.useQuery();
  const { data: recommended } = api.billing.getRecommendedPackage.useQuery();

  if (dismissed || !balance || balance.credits >= threshold) {
    return null;
  }

  const isUrgent = balance.credits === 0;

  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${
        isUrgent
          ? "border-red-500/50 bg-red-500/10"
          : "border-yellow-500/50 bg-yellow-500/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-full p-2 ${
            isUrgent ? "bg-red-500/20" : "bg-yellow-500/20"
          }`}
        >
          <AlertTriangle
            className={`h-5 w-5 ${
              isUrgent ? "text-red-400" : "text-yellow-400"
            }`}
          />
        </div>

        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              isUrgent ? "text-red-400" : "text-yellow-400"
            }`}
          >
            {isUrgent ? "Out of Credits!" : "Low Credit Balance"}
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            {isUrgent
              ? "You have no credits left. Purchase more to continue creating videos."
              : `You have ${balance.credits} ${
                  balance.credits === 1 ? "credit" : "credits"
                } remaining. Consider purchasing more to avoid interruptions.`}
          </p>

          {recommended && (
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">
                    Recommended: {recommended.package.name}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {recommended.package.credits} credits for $
                  {(recommended.package.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Purchase Credits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}


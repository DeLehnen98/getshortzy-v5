"use client";

import { api } from "~/lib/trpc/client";
import { Sparkles, Plus } from "lucide-react";
import Link from "next/link";

interface CreditsDisplayProps {
  showPurchaseButton?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CreditsDisplay({
  showPurchaseButton = true,
  size = "md",
}: CreditsDisplayProps) {
  const { data: balance, isLoading } = api.billing.getBalance.useQuery();

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-gray-800 bg-gray-900/50 ${sizeClasses[size]} animate-pulse`}>
        <div className="h-5 w-20 bg-gray-800 rounded"></div>
      </div>
    );
  }

  const credits = balance?.credits || 0;
  const isLow = credits < 5;
  const isEmpty = credits === 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-lg border ${
          isEmpty
            ? "border-red-500/50 bg-red-500/10"
            : isLow
            ? "border-yellow-500/50 bg-yellow-500/10"
            : "border-purple-500/50 bg-purple-500/10"
        } ${sizeClasses[size]}`}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            className={`${iconSizes[size]} ${
              isEmpty
                ? "text-red-400"
                : isLow
                ? "text-yellow-400"
                : "text-purple-400"
            }`}
          />
          <span
            className={`font-bold ${
              isEmpty
                ? "text-red-400"
                : isLow
                ? "text-yellow-400"
                : "text-purple-400"
            }`}
          >
            {credits}
          </span>
          <span className="text-gray-400 text-sm">
            {credits === 1 ? "credit" : "credits"}
          </span>
        </div>
      </div>

      {showPurchaseButton && (
        <Link
          href="/dashboard/billing"
          className="rounded-lg border border-purple-500/50 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Link>
      )}
    </div>
  );
}


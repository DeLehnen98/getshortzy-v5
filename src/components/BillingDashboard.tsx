"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/client";
import {
  CreditCard,
  TrendingUp,
  Package,
  History,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Video,
  FileText,
  Scissors,
} from "lucide-react";

export default function BillingDashboard() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const { data: summary, isLoading } = api.billing.getSummary.useQuery();
  const { data: packages } = api.billing.getPackages.useQuery();
  const { data: costs } = api.billing.getCosts.useQuery();

  const createCheckoutMutation = api.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      // Redirect to checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handlePurchase = (packageId: string) => {
    createCheckoutMutation.mutate({ packageId, provider: "stripe" });
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "VIDEO_UPLOAD":
      case "YOUTUBE_IMPORT":
        return <Video className="h-4 w-4" />;
      case "TRANSCRIPTION":
        return <FileText className="h-4 w-4" />;
      case "CLIP_GENERATION":
      case "ADDITIONAL_CLIP":
        return <Scissors className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Credits</h1>
        <p className="text-gray-400">
          Manage your credits, view usage, and purchase packages
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Sparkles className="h-6 w-6" />}
          label="Current Balance"
          value={summary?.currentBalance.toString() || "0"}
          suffix="credits"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Credits Used"
          value={summary?.totalCreditsUsed.toString() || "0"}
          suffix="total"
          color="blue"
        />
        <StatCard
          icon={<Video className="h-6 w-6" />}
          label="Projects Created"
          value={summary?.projectsCreated.toString() || "0"}
          color="green"
        />
        <StatCard
          icon={<Scissors className="h-6 w-6" />}
          label="Clips Generated"
          value={summary?.clipsGenerated.toString() || "0"}
          color="yellow"
        />
      </div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Credit Packages</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {packages?.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-lg border bg-gray-900/50 p-6 transition-all ${
                pkg.popular
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              {pkg.popular && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {pkg.credits} credits
                </p>
                {pkg.savings && (
                  <p className="text-sm text-green-400 mt-1">{pkg.savings}</p>
                )}
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={createCheckoutMutation.isPending}
                className={`w-full rounded-lg px-4 py-3 font-medium transition-all ${
                  pkg.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {createCheckoutMutation.isPending ? "Processing..." : "Purchase"}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-400">
                  ${(pkg.price / 100 / pkg.credits).toFixed(2)} per credit
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Costs */}
      {costs && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Credit Costs</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {Object.entries(costs).map(([action, cost]) => (
                  <tr key={action} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">{getActionIcon(action)}</div>
                        <span className="text-sm font-medium text-white">
                          {action.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-white">
                        {cost} {cost === 1 ? "credit" : "credits"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Usage Breakdown */}
      {summary?.usageByAction && summary.usageByAction.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Usage Breakdown</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summary.usageByAction.map((item) => (
              <div
                key={item.action}
                className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-400">{getActionIcon(item.action)}</div>
                    <span className="text-sm font-medium text-white">
                      {item.action.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    {item.credits}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {item.count} {item.count === 1 ? "time" : "times"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {summary?.recentTransactions && summary.recentTransactions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Transactions
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="divide-y divide-gray-800">
              {summary.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.type === "purchase"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          transaction.type === "purchase"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "purchase" ? "+" : ""}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-gray-400">credits</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  color: string;
}) {
  const colorClasses = {
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`rounded-lg border p-2 ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {suffix && <p className="text-sm text-gray-400">{suffix}</p>}
      </div>
    </div>
  );
}


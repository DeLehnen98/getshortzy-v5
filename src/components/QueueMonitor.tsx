"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/client";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  XCircle,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function QueueMonitor() {
  const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("day");

  const { data: stats, refetch: refetchStats } = api.queue.getStats.useQuery(
    undefined,
    { refetchInterval: 10000 } // Refresh every 10 seconds
  );

  const { data: health } = api.queue.getSystemHealth.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: performance } = api.queue.getPerformanceSummary.useQuery(
    { timeRange },
    { refetchInterval: 60000 } // Refresh every minute
  );

  const { data: bottlenecks } = api.queue.getBottlenecks.useQuery(undefined, {
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getHealthColor = (status?: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "degraded":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Queue Monitor</h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time system performance and queue status
          </p>
        </div>
        <button
          onClick={() => refetchStats()}
          className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* System Health */}
      {health && (
        <div
          className={`rounded-lg border p-6 ${getHealthColor(health.status)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {health.status === "healthy" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : health.status === "degraded" ? (
                <AlertTriangle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
              <div>
                <h3 className="text-lg font-bold">
                  System Status: {health.status.toUpperCase()}
                </h3>
                <p className="text-sm opacity-80">
                  {health.issues.length === 0
                    ? "All systems operational"
                    : `${health.issues.length} issue${
                        health.issues.length > 1 ? "s" : ""
                      } detected`}
                </p>
              </div>
            </div>
          </div>

          {health.issues.length > 0 && (
            <div className="space-y-2">
              {health.issues.map((issue, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-black/20 px-3 py-2 text-sm"
                >
                  • {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Queue Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending Jobs"
            value={stats.pending.toString()}
            color="yellow"
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            label="Running Jobs"
            value={stats.running.toString()}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Completed"
            value={stats.completed.toString()}
            color="green"
          />
          <StatCard
            icon={<XCircle className="h-5 w-5" />}
            label="Failed"
            value={stats.failed.toString()}
            color="red"
          />
        </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Performance Metrics
            </h3>
            <div className="flex gap-2">
              {(["hour", "day", "week"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Average Job Duration */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Average Job Duration
              </h4>
              <div className="space-y-2">
                {Object.entries(performance.avgJobDuration).map(
                  ([type, duration]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-white">
                        {type.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-purple-400">
                        {(duration / 1000).toFixed(1)}s
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Error Rates */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Error Rates
              </h4>
              <div className="space-y-2">
                {Object.entries(performance.errorRates).map(([type, rate]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-white">
                      {type.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        rate > 0.1
                          ? "text-red-400"
                          : rate > 0.05
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {(rate * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottlenecks */}
      {bottlenecks && bottlenecks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            Identified Bottlenecks
          </h3>
          <div className="space-y-3">
            {bottlenecks.map((bottleneck, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      bottleneck.severity === "high"
                        ? "bg-red-500/10"
                        : bottleneck.severity === "medium"
                        ? "bg-yellow-500/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${getSeverityColor(
                        bottleneck.severity
                      )}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">
                        {bottleneck.component}
                      </h4>
                      <span
                        className={`text-xs font-medium ${getSeverityColor(
                          bottleneck.severity
                        )}`}
                      >
                        {bottleneck.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {bottleneck.description}
                    </p>
                    <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-2">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-purple-400 mt-0.5" />
                        <p className="text-sm text-purple-400">
                          {bottleneck.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs by Type */}
      {stats && stats.jobsByType.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            Jobs by Type (Last 24h)
          </h3>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {stats.jobsByType.map((item) => (
                  <tr key={item.type} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-white">
                      {item.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-purple-400">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`rounded-lg border p-2 ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}


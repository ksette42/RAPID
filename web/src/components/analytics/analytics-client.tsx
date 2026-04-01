"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Split recharts out of the main bundle — only loads when analytics page is visited
const LazyCharts = dynamic(() => import("./charts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
          <div className="h-5 w-36 bg-muted rounded" />
          <div className="h-48 w-full bg-muted/20 rounded-lg" />
        </div>
      ))}
    </div>
  ),
});

import {
  TrendingDown,
  ShieldCheck,
  Zap,
  BarChart3,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsClientProps {
  analyses: Array<{
    id: string;
    createdAt: Date;
    status: string;
    type: string;
    costSavings: number | null;
    reliabilityScore: number | null;
    performanceScore: number | null;
    language: string | null;
  }>;
  suggestions: Array<{
    category: string;
    status: string;
    priority: string;
    estimatedSaving: number | null;
  }>;
  implementations: Array<{
    status: string;
    createdAt: Date;
  }>;
}


export function AnalyticsClient({ analyses, suggestions, implementations }: AnalyticsClientProps) {
  const totalSavings = suggestions.reduce((acc, s) => acc + (s.estimatedSaving ?? 0), 0);
  const avgReliability = analyses.reduce((acc, a) => acc + (a.reliabilityScore ?? 0), 0) / (analyses.length || 1);
  const avgPerformance = analyses.reduce((acc, a) => acc + (a.performanceScore ?? 0), 0) / (analyses.length || 1);
  const implementedCount = implementations.filter(i => i.status === "COMPLETED").length;

  // Defer date/locale work until after mount so server and client HTML match
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Monthly analysis trend — computed only on client to avoid locale mismatch
  const monthlyData = useMemo(() => {
    if (!mounted) {
      // Return stable placeholder data during SSR/hydration
      return Array.from({ length: 6 }, (_, i) => ({
        month: `M${i + 1}`,
        analyses: 0,
        savings: 0,
      }));
    }
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleString("en-US", { month: "short" }); // fixed locale
      const year = date.getFullYear();
      const monthAnalyses = analyses.filter(a => {
        const ad = new Date(a.createdAt);
        return ad.getMonth() === date.getMonth() && ad.getFullYear() === year;
      });
      return {
        month,
        analyses: monthAnalyses.length,
        savings: monthAnalyses.reduce((acc, a) => acc + (a.costSavings ?? 0), 0),
      };
    });
  }, [mounted, analyses]);

  // Category distribution
  const categoryData = Object.entries(
    suggestions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  // Language distribution
  const languageData = Object.entries(
    analyses
      .filter(a => a.language)
      .reduce((acc, a) => {
        const lang = a.language!;
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Suggestion status breakdown
  const statusData = [
    { name: "Pending", value: suggestions.filter(s => s.status === "PENDING").length, color: "#f59e0b" },
    { name: "Approved", value: suggestions.filter(s => s.status === "APPROVED").length, color: "#6172f4" },
    { name: "Implemented", value: suggestions.filter(s => s.status === "IMPLEMENTED").length, color: "#22c55e" },
    { name: "Dismissed", value: suggestions.filter(s => s.status === "DISMISSED" || s.status === "REJECTED").length, color: "#6b7280" },
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track the impact of RAPID on your systems over time.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <TrendingDown className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalSavings)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Total Potential Savings/mo</div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4">
            <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-blue-400">{Math.round(avgReliability)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Avg Reliability Score</div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4">
            <Zap className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-purple-400">{Math.round(avgPerformance)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Avg Performance Score</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4">
            <CheckCircle2 className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{implementedCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Changes Implemented</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts — loaded lazily to split bundle */}
      <LazyCharts
        monthlyData={monthlyData}
        categoryData={categoryData}
        languageData={languageData}
      />

      {/* Empty state */}
      {analyses.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">No analytics data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Run analyses to see your insights here</p>
        </div>
      )}
    </div>
  );
}

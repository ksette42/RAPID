import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Zap,
  Code2,
  Sparkles,
  GitMerge,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { formatDate, formatSuggestionCategory } from "@/lib/utils";

async function getDashboardData(userId: string) {
  const [analyses, suggestions, implementations] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        suggestions: {
          select: { id: true, status: true, category: true },
        },
      },
    }),
    prisma.suggestion.findMany({
      where: { analysis: { userId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, title: true, category: true, priority: true,
        estimatedSaving: true, status: true,
      },
    }),
    prisma.implementation.findMany({
      where: { analysis: { userId } },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true },
    }),
  ]);

  const completedAnalyses = analyses.filter((a) => a.status === "COMPLETED").length;
  const pendingSuggestions = suggestions.filter((s) => s.status === "PENDING").length;
  const implementedCount = implementations.filter(
    (i) => i.status === "COMPLETED"
  ).length;

  return {
    analyses,
    suggestions,
    implementations,
    stats: {
      completedAnalyses,
      pendingSuggestions,
      implementedCount,
      totalAnalyses: analyses.length,
    },
  };
}

export default async function DashboardPage() {
  // Session already validated in layout — reuse via getServerSession cache
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user.id);

  const statCards = [
    {
      title: "Analyses Run",
      value: data.stats.totalAnalyses.toString(),
      description: `${data.stats.completedAnalyses} completed`,
      icon: Code2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      trend: "5 this week",
    },
    {
      title: "Open Findings",
      value: data.stats.pendingSuggestions.toString(),
      description: "Awaiting your review",
      icon: Sparkles,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      trend: "Action needed",
    },
    {
      title: "Implementations",
      value: data.stats.implementedCount.toString(),
      description: "Changes applied",
      icon: GitMerge,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      trend: "All approved by you",
    },
  ];

  const analysisStatusMap: Record<string, { label: string; variant: any; icon: any }> = {
    PENDING: { label: "Pending", variant: "warning", icon: Clock },
    PROCESSING: { label: "Processing", variant: "info", icon: Zap },
    COMPLETED: { label: "Completed", variant: "success", icon: CheckCircle2 },
    FAILED: { label: "Failed", variant: "destructive", icon: AlertTriangle },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-muted-foreground">
            Here is a quick view of your recent analysis activity.
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/analyze">
            <Code2 className="w-4 h-4 mr-2" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{stat.trend}</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium mt-0.5">{stat.title}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Analyses */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Analyses</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/analyze">
                    View all <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.analyses.length === 0 ? (
                <div className="text-center py-8">
                  <Code2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No analyses yet</p>
                  <Button variant="gradient" size="sm" className="mt-3" asChild>
                    <Link href="/dashboard/analyze">Run your first analysis</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.analyses.map((analysis) => {
                    const status = analysisStatusMap[analysis.status];
                    const StatusIcon = status.icon;
                    return (
                      <Link
                        key={analysis.id}
                        href={`/dashboard/analyze/${analysis.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-rapid-500/10 rounded-lg flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-rapid-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{analysis.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {analysis.language} · {formatDate(analysis.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={status.variant} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Open Findings */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Open Findings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/suggestions">
                    Review all <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.suggestions.filter(s => s.status === "PENDING").length === 0 ? (
                <div className="text-center py-6">
                  <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No open findings</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.suggestions.filter(s => s.status === "PENDING").slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          s.priority === "CRITICAL" ? "bg-red-500" :
                          s.priority === "HIGH" ? "bg-orange-500" :
                          s.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{s.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatSuggestionCategory(s.category)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {s.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Focus</CardTitle>
              <CardDescription>
                A compact summary of what to do next.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <span className="text-sm">Recent analyses</span>
                <span className="text-sm font-medium">{data.stats.totalAnalyses}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <span className="text-sm">Awaiting review</span>
                <span className="text-sm font-medium">{data.stats.pendingSuggestions}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <span className="text-sm">Implemented changes</span>
                <span className="text-sm font-medium">{data.stats.implementedCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/dashboard/analyze", icon: Code2, label: "Run Analysis", color: "text-blue-400" },
                { href: "/dashboard/suggestions", icon: Sparkles, label: "Review Findings", color: "text-yellow-400" },
                { href: "/dashboard/implementation", icon: GitMerge, label: "Apply Changes", color: "text-purple-400" },
                { href: "/dashboard/documentation", icon: FileText, label: "Open Documents", color: "text-pink-400" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors group"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

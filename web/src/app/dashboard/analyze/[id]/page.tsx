import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatSuggestionCategory } from "@/lib/utils";

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session!.user.id },
    include: {
      suggestions: { orderBy: { priority: "asc" } },
      documents: { select: { id: true, title: true, content: true } },
    },
  });

  if (!analysis) notFound();

  const priorityColors: Record<string, string> = {
    CRITICAL: "destructive",
    HIGH: "warning",
    MEDIUM: "info",
    LOW: "secondary",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/analyze">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analyses
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{analysis.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{analysis.language || analysis.type}</Badge>
            <Badge
              variant={
                analysis.status === "COMPLETED"
                  ? "success"
                  : analysis.status === "FAILED"
                  ? "destructive"
                  : "info"
              }
            >
              {analysis.status}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(analysis.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rapid-500/30 bg-rapid-500/5">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-6 h-6 text-rapid-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-rapid-400">
              {analysis.suggestions.length}
            </div>
            <p className="text-sm text-muted-foreground">Findings</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {analysis.reliabilityScore ?? 0}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground">Reliability Score</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {analysis.performanceScore ?? 0}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground">Performance Score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList>
          <TabsTrigger value="suggestions">
            Findings ({analysis.suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents ({analysis.documents.length})
          </TabsTrigger>
          {analysis.rawContent && (
            <TabsTrigger value="code">Original Code</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="suggestions" className="mt-4 space-y-3">
          {analysis.suggestions.map((s) => (
            <Card key={s.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={(priorityColors[s.priority] as any) || "secondary"} className="text-xs">
                      {s.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatSuggestionCategory(s.category)}
                    </Badge>
                  </div>
                  <Badge
                    variant={s.status === "IMPLEMENTED" ? "success" : s.status === "APPROVED" ? "info" : "secondary"}
                    className="text-xs"
                  >
                    {s.status}
                  </Badge>
                </div>
                <h3 className="font-medium mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                {s.codeSnippet && (
                  <pre className="mt-3 bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
                    <code>{s.codeSnippet}</code>
                  </pre>
                )}
                {s.improvedCode && (
                  <div className="mt-2">
                    <p className="text-xs text-green-400 mb-1">Suggested Fix:</p>
                    <pre className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-xs overflow-x-auto">
                      <code>{s.improvedCode}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="mt-4 space-y-3">
          {analysis.documents.map((doc) => (
            <Card key={doc.id} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono text-xs overflow-auto max-h-64">
                  {doc.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {analysis.rawContent && (
          <TabsContent value="code" className="mt-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-96">
                  {analysis.rawContent}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

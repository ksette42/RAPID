"use client";

import { useState, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  GitMerge,
  Lightbulb,
  ShieldCheck,
  Zap,
  Lock,
  Wrench,
  BarChart3,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatSuggestionCategory } from "@/lib/utils";
import Link from "next/link";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimatedSaving: number | null;
  estimatedEffort: string | null;
  codeSnippet: string | null;
  improvedCode: string | null;
  status: string;
  analysis: {
    id: string;
    title: string;
    language: string | null;
  };
}

const categoryIcons: Record<string, any> = {
  COST_SAVING: Zap,
  PERFORMANCE: Zap,
  RELIABILITY: ShieldCheck,
  SECURITY: Lock,
  MAINTAINABILITY: Wrench,
  SCALABILITY: BarChart3,
};

const categoryColors: Record<string, string> = {
  COST_SAVING: "text-cyan-400",
  PERFORMANCE: "text-blue-400",
  RELIABILITY: "text-yellow-400",
  SECURITY: "text-red-400",
  MAINTAINABILITY: "text-purple-400",
  SCALABILITY: "text-cyan-400",
};

const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

// Defined outside SuggestionsClient to prevent remounting on every parent render
const SuggestionCard = memo(function SuggestionCard({
  suggestion,
  expandedId,
  loading,
  onExpand,
  onAction,
}: {
  suggestion: Suggestion;
  expandedId: string | null;
  loading: string | null;
  onExpand: (id: string | null) => void;
  onAction: (id: string, action: "approve" | "dismiss" | "implement") => void;
}) {
  const Icon = categoryIcons[suggestion.category] || Lightbulb;
  const color = categoryColors[suggestion.category] || "text-muted-foreground";
  const isExpanded = expandedId === suggestion.id;

  return (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-sm">{suggestion.title}</h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge
                  variant={
                    suggestion.priority === "CRITICAL" ? "destructive" :
                    suggestion.priority === "HIGH" ? "warning" :
                    suggestion.priority === "MEDIUM" ? "info" : "secondary"
                  }
                  className="text-xs"
                >
                  {suggestion.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {formatSuggestionCategory(suggestion.category)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {suggestion.analysis.title}
              </span>
              {suggestion.estimatedEffort && (
                <span className="text-xs text-muted-foreground">· {suggestion.estimatedEffort}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {suggestion.description}
            </p>
            {isExpanded && (
              <div className="space-y-3 mt-3">
                {suggestion.codeSnippet && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Code:</p>
                    <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
                      <code>{suggestion.codeSnippet}</code>
                    </pre>
                  </div>
                )}
                {suggestion.improvedCode && (
                  <div>
                    <p className="text-xs text-green-400 mb-1">Suggested Implementation:</p>
                    <pre className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-xs overflow-x-auto">
                      <code>{suggestion.improvedCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => onExpand(isExpanded ? null : suggestion.id)}
              >
                {isExpanded ? "Show less" : "Show details"}
                {suggestion.codeSnippet && " & code"}
              </button>
              {suggestion.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm" variant="outline"
                    className="h-7 text-xs text-red-400 hover:text-red-300 hover:border-red-400"
                    onClick={() => onAction(suggestion.id, "dismiss")}
                    disabled={loading === suggestion.id}
                  >
                    <XCircle className="w-3 h-3 mr-1" />Dismiss
                  </Button>
                  <Button
                    size="sm" variant="gradient" className="h-7 text-xs"
                    onClick={() => onAction(suggestion.id, "approve")}
                    disabled={loading === suggestion.id}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                  </Button>
                </div>
              )}
              {suggestion.status === "APPROVED" && (
                <Button size="sm" variant="outline" className="h-7 text-xs"
                  onClick={() => onAction(suggestion.id, "implement")}
                  disabled={loading === suggestion.id}
                >
                  <GitMerge className="w-3 h-3 mr-1" />Implement Now
                </Button>
              )}
              {suggestion.status === "IMPLEMENTED" && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />Implemented
                </Badge>
              )}
              {(suggestion.status === "DISMISSED" || suggestion.status === "REJECTED") && (
                <Badge variant="secondary" className="text-xs">Dismissed</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function SuggestionsClient({ suggestions: initialSuggestions }: { suggestions: Suggestion[] }) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pending = suggestions.filter((s) => s.status === "PENDING");
  const approved = suggestions.filter((s) => s.status === "APPROVED");
  const implemented = suggestions.filter((s) => s.status === "IMPLEMENTED");
  const dismissed = suggestions.filter((s) => s.status === "DISMISSED" || s.status === "REJECTED");

  const handleAction = async (suggestionId: string, action: "approve" | "dismiss" | "implement") => {
    setLoading(suggestionId);
    try {
      const res = await fetch(`/api/suggestions/${suggestionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Failed to update suggestion");

      const statusMap = {
        approve: "APPROVED",
        dismiss: "DISMISSED",
        implement: "IMPLEMENTED",
      };

      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId ? { ...s, status: statusMap[action] } : s
        )
      );

      toast({
        title: action === "approve" ? "Suggestion Approved" : action === "dismiss" ? "Suggestion Dismissed" : "Queued for Implementation",
        description: action === "approve"
          ? "This change will be queued for implementation."
          : action === "implement"
          ? "The change has been queued. Review in the Implementation tab."
          : "Suggestion dismissed.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to update suggestion.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const filterSuggestions = useCallback((list: Suggestion[]) => {
    if (filter === "ALL") return list;
    return list.filter((s) => s.category === filter);
  }, [filter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Findings</h1>
          <p className="text-muted-foreground">
            Review and approve AI-generated findings for your analyses.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          {pending.length} awaiting review
        </Badge>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "COST_SAVING", "PERFORMANCE", "RELIABILITY", "SECURITY", "MAINTAINABILITY"].map((cat) => {
          const Icon = cat === "ALL" ? Filter : categoryIcons[cat];
          return (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFilter(cat)}
            >
              {Icon && <Icon className="w-3 h-3 mr-1.5" />}
              {cat === "ALL" ? cat : formatSuggestionCategory(cat)}
            </Button>
          );
        })}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge variant="warning" className="ml-1.5 text-xs py-0 px-1.5">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="implemented">Implemented ({implemented.length})</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed ({dismissed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {filterSuggestions(pending).length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium">No pending findings</p>
              <p className="text-sm text-muted-foreground mt-1">
                Run an analysis to generate findings
              </p>
              <Button variant="gradient" size="sm" className="mt-4" asChild>
                <Link href="/dashboard/analyze">Run Analysis</Link>
              </Button>
            </div>
          ) : (
            filterSuggestions(pending)
              .sort((a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3))
              .map((s) => <SuggestionCard key={s.id} suggestion={s} expandedId={expandedId} loading={loading} onExpand={setExpandedId} onAction={handleAction} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {filterSuggestions(approved).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved findings yet</p>
            </div>
          ) : (
            filterSuggestions(approved).map((s) => <SuggestionCard key={s.id} suggestion={s} expandedId={expandedId} loading={loading} onExpand={setExpandedId} onAction={handleAction} />)
          )}
        </TabsContent>

        <TabsContent value="implemented" className="mt-4 space-y-3">
          {filterSuggestions(implemented).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No implemented findings yet</p>
            </div>
          ) : (
            filterSuggestions(implemented).map((s) => <SuggestionCard key={s.id} suggestion={s} expandedId={expandedId} loading={loading} onExpand={setExpandedId} onAction={handleAction} />)
          )}
        </TabsContent>

        <TabsContent value="dismissed" className="mt-4 space-y-3">
          {filterSuggestions(dismissed).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No dismissed findings</p>
            </div>
          ) : (
            filterSuggestions(dismissed).map((s) => <SuggestionCard key={s.id} suggestion={s} expandedId={expandedId} loading={loading} onExpand={setExpandedId} onAction={handleAction} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

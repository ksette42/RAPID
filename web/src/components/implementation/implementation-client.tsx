"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  GitMerge,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Clock,
  Loader2,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatSuggestionCategory } from "@/lib/utils";
import Link from "next/link";

interface Implementation {
  id: string;
  title: string;
  description: string | null;
  status: string;
  approvedAt: Date | null;
  appliedAt: Date | null;
  originalCode: string | null;
  appliedCode: string | null;
  createdAt: Date;
  analysis: { id: string; title: string; language: string | null };
  suggestion: {
    title: string;
    category: string;
    priority: string;
    codeSnippet: string | null;
    improvedCode: string | null;
  } | null;
}

export function ImplementationClient({ implementations }: { implementations: Implementation[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedImpl, setSelectedImpl] = useState<Implementation | null>(null);
  const [diffOpen, setDiffOpen] = useState(false);

  const pending = implementations.filter((i) => i.status === "PENDING" || i.status === "APPROVED");
  const completed = implementations.filter((i) => i.status === "COMPLETED");
  const rolledBack = implementations.filter((i) => i.status === "ROLLED_BACK");

  const handleApply = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/implement/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply" }),
      });
      if (!res.ok) throw new Error("Failed to apply");
      toast({ title: "Implementation Applied", description: "The change has been recorded as applied." });
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Failed to apply implementation.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleRollback = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/implement/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback" }),
      });
      if (!res.ok) throw new Error("Failed to rollback");
      toast({ title: "Rolled Back", description: "The implementation has been rolled back." });
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Failed to rollback.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const statusInfo: Record<string, { label: string; variant: any; icon: any }> = {
    PENDING: { label: "Pending Approval", variant: "warning", icon: Clock },
    APPROVED: { label: "Ready to Apply", variant: "info", icon: ShieldCheck },
    IN_PROGRESS: { label: "In Progress", variant: "info", icon: Loader2 },
    COMPLETED: { label: "Completed", variant: "success", icon: CheckCircle2 },
    ROLLED_BACK: { label: "Rolled Back", variant: "secondary", icon: RotateCcw },
    FAILED: { label: "Failed", variant: "destructive", icon: AlertTriangle },
  };

  const ImplCard = ({ impl }: { impl: Implementation }) => {
    const status = statusInfo[impl.status] || statusInfo.PENDING;
    const StatusIcon = status.icon;

    return (
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-rapid-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <GitMerge className="w-4 h-4 text-rapid-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-sm">{impl.title}</h3>
                  <Badge variant={status.variant} className="text-xs">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">
                    {impl.analysis.title}
                  </span>
                  {impl.suggestion && (
                    <>
                      <span className="text-xs text-muted-foreground">·</span>
                      <Badge variant="outline" className="text-xs">
                        {formatSuggestionCategory(impl.suggestion.category)}
                      </Badge>
                    </>
                  )}
                </div>

                {impl.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{impl.description}</p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {impl.approvedAt && (
                    <span>Approved: {formatDate(impl.approvedAt)}</span>
                  )}
                  {impl.appliedAt && (
                    <span>Applied: {formatDate(impl.appliedAt)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              {(impl.originalCode || impl.appliedCode || impl.suggestion?.codeSnippet) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setSelectedImpl(impl); setDiffOpen(true); }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Diff
                </Button>
              )}

              {impl.status === "APPROVED" && (
                <Button
                  variant="gradient"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleApply(impl.id)}
                  disabled={loading === impl.id}
                >
                  {loading === impl.id ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  Apply
                </Button>
              )}

              {impl.status === "COMPLETED" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-orange-400 hover:text-orange-300"
                  onClick={() => handleRollback(impl.id)}
                  disabled={loading === impl.id}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Rollback
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Implementation</h1>
        <p className="text-muted-foreground">
          Track and apply approved changes. Every action requires your explicit approval.
        </p>
      </div>

      {/* Safety notice */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-400">Client Permission Required</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              RAPID never implements changes automatically. Every change is reviewed by you before being applied.
              You maintain full control at all times.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{pending.length}</div>
            <div className="text-xs text-muted-foreground">Awaiting Action</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{completed.length}</div>
            <div className="text-xs text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{rolledBack.length}</div>
            <div className="text-xs text-muted-foreground">Rolled Back</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge variant="warning" className="ml-1.5 text-xs py-0 px-1.5">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Applied ({completed.length})</TabsTrigger>
          <TabsTrigger value="rolledback">Rolled Back ({rolledBack.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <div className="text-center py-16">
              <GitMerge className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium">No pending implementations</p>
              <p className="text-sm text-muted-foreground mt-1">
                Approve findings to queue them for implementation
              </p>
              <Button variant="gradient" size="sm" className="mt-4" asChild>
                <Link href="/dashboard/suggestions">Review Findings</Link>
              </Button>
            </div>
          ) : (
            pending.map((impl) => <ImplCard key={impl.id} impl={impl} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No applied implementations yet</p>
            </div>
          ) : (
            completed.map((impl) => <ImplCard key={impl.id} impl={impl} />)
          )}
        </TabsContent>

        <TabsContent value="rolledback" className="mt-4 space-y-3">
          {rolledBack.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rolled back implementations</p>
            </div>
          ) : (
            rolledBack.map((impl) => <ImplCard key={impl.id} impl={impl} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Diff Dialog */}
      <Dialog open={diffOpen} onOpenChange={setDiffOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Code Diff: {selectedImpl?.title}</DialogTitle>
            <DialogDescription>
              Before and after comparison for this change
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(selectedImpl?.originalCode || selectedImpl?.suggestion?.codeSnippet) && (
              <div>
                <p className="text-xs text-red-400 mb-2 font-medium">Original Code (Before)</p>
                <pre className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-xs overflow-x-auto">
                  <code>{selectedImpl.originalCode || selectedImpl.suggestion?.codeSnippet}</code>
                </pre>
              </div>
            )}
            {(selectedImpl?.appliedCode || selectedImpl?.suggestion?.improvedCode) && (
              <div>
                <p className="text-xs text-green-400 mb-2 font-medium">Improved Code (After)</p>
                <pre className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-xs overflow-x-auto">
                  <code>{selectedImpl.appliedCode || selectedImpl.suggestion?.improvedCode}</code>
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDiffOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

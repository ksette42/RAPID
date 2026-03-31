"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Code2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  Zap,
  FileText,
  ArrowRight,
  Play,
  Clock,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency, getLanguageFromExtension } from "@/lib/utils";
import Link from "next/link";

interface Analysis {
  id: string;
  title: string;
  status: string;
  language: string | null;
  type: string;
  costSavings: number | null;
  reliabilityScore: number | null;
  performanceScore: number | null;
  createdAt: Date;
  suggestions: Array<{ id: string; status: string; estimatedSaving: number | null }>;
}

const analysisTypes = [
  { value: "CODE", label: "Source Code", icon: Code2, description: "JavaScript, Python, Go, Rust, Java, and 50+ more" },
  { value: "DATABASE", label: "Database Schema", icon: BarChart3, description: "SQL schemas, query plans, indexes" },
  { value: "DASHBOARD", label: "Dashboard / Metrics", icon: BarChart3, description: "Grafana exports, JSON configs, metrics data" },
  { value: "API", label: "API Definition", icon: Zap, description: "OpenAPI/Swagger specs, REST endpoints" },
  { value: "INFRASTRUCTURE", label: "Infrastructure", icon: ShieldCheck, description: "Terraform, Kubernetes, Docker configs" },
  { value: "GENERAL", label: "General Data", icon: FileText, description: "Any structured or semi-structured data" },
];

export function AnalyzeClient({ analyses }: { analyses: Analysis[] }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [analysisType, setAnalysisType] = useState("CODE");
  const [title, setTitle] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (e) => {
      setCodeContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/*": [],
      "application/json": [".json"],
      "application/javascript": [".js"],
      "application/typescript": [".ts", ".tsx"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const runAnalysis = async () => {
    if (!codeContent.trim()) {
      toast({ title: "Error", description: "Please provide code or data to analyze.", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Error", description: "Please provide a title for this analysis.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 800);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: codeContent,
          type: analysisType,
          fileName,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysisResult(data);
      toast({ title: "Analysis Complete!", description: "Your code has been analyzed successfully." });
      setActiveTab("result");
    } catch (err: any) {
      toast({ title: "Analysis Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analyze</h1>
        <p className="text-muted-foreground">
          Upload code, paste snippets, or connect your repository for AI-powered analysis.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">New Analysis</TabsTrigger>
          <TabsTrigger value="history">History ({analyses.length})</TabsTrigger>
          {analysisResult && <TabsTrigger value="result">Latest Result</TabsTrigger>}
        </TabsList>

        {/* New Analysis */}
        <TabsContent value="new" className="space-y-6 mt-6">
          {/* Analysis Type */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">What are you analyzing?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setAnalysisType(type.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      analysisType === type.value
                        ? "border-rapid-500 bg-rapid-500/10"
                        : "border-border/50 hover:border-border hover:bg-accent/50"
                    }`}
                  >
                    <type.icon className={`w-5 h-5 mb-1.5 ${analysisType === type.value ? "text-rapid-400" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload / Paste */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Code or Data</CardTitle>
              <CardDescription>Upload a file or paste your code directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Analysis Title</Label>
                <Input
                  placeholder="e.g. payment-service analysis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-rapid-500 bg-rapid-500/5"
                    : "border-border hover:border-rapid-500/50 hover:bg-accent/30"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                {fileName ? (
                  <div>
                    <p className="text-sm font-medium text-rapid-400">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getLanguageFromExtension(fileName)} detected
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium">Drop your file here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports all programming languages, JSON, YAML, SQL, and more. Max 5MB.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or paste code</span>
                </div>
              </div>

              <textarea
                className="w-full h-64 p-3 rounded-lg border border-input bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`Paste your code here...\n\n// Example:\nfunction getUserData(userId) {\n  return db.query('SELECT * FROM users WHERE id = ' + userId);\n}`}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
              />

              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={runAnalysis}
                disabled={loading}
                variant="gradient"
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-6">
          <Card className="border-border/50">
            <CardContent className="p-0">
              {analyses.length === 0 ? (
                <div className="text-center py-16">
                  <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">No analyses yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Run your first analysis to get started
                  </p>
                  <Button variant="gradient" size="sm" className="mt-4" onClick={() => setActiveTab("new")}>
                    New Analysis
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {analyses.map((analysis) => {
                    const pendingSuggestions = analysis.suggestions.filter(s => s.status === "PENDING").length;
                    const totalSavings = analysis.suggestions.reduce((acc, s) => acc + (s.estimatedSaving ?? 0), 0);
                    return (
                      <Link
                        key={analysis.id}
                        href={`/dashboard/analyze/${analysis.id}`}
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-rapid-500/10 rounded-xl flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-rapid-400" />
                          </div>
                          <div>
                            <p className="font-medium">{analysis.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {analysis.language || analysis.type}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(analysis.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {totalSavings > 0 && (
                            <Badge variant="success" className="text-xs hidden sm:flex">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Save {formatCurrency(totalSavings)}/mo
                            </Badge>
                          )}
                          {pendingSuggestions > 0 && (
                            <Badge variant="warning" className="text-xs">
                              {pendingSuggestions} pending
                            </Badge>
                          )}
                          <Badge
                            variant={
                              analysis.status === "COMPLETED" ? "success" :
                              analysis.status === "FAILED" ? "destructive" :
                              analysis.status === "PROCESSING" ? "info" : "warning"
                            }
                            className="text-xs"
                          >
                            {analysis.status}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Result */}
        {analysisResult && (
          <TabsContent value="result" className="mt-6">
            <AnalysisResultView result={analysisResult} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function AnalysisResultView({ result }: { result: any }) {
  if (!result) return null;

  const { analysis, suggestions } = result;

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(analysis?.costSavings ?? 0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground">Potential Cost Savings</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {analysis?.reliabilityScore ?? 0}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground">Reliability Score</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {analysis?.performanceScore ?? 0}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground">Performance Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">
            {suggestions?.length ?? 0} Improvement Suggestions
          </CardTitle>
          <CardDescription>
            Ordered by priority and estimated impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(suggestions || []).map((s: any, i: number) => (
            <div key={i} className="p-4 rounded-xl border border-border/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    s.priority === "CRITICAL" ? "destructive" :
                    s.priority === "HIGH" ? "warning" :
                    s.priority === "MEDIUM" ? "info" : "secondary"
                  } className="text-xs">
                    {s.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {s.category?.replace("_", " ")}
                  </Badge>
                </div>
                {s.estimatedSaving > 0 && (
                  <Badge variant="success" className="text-xs">
                    Save {formatCurrency(s.estimatedSaving)}/mo
                  </Badge>
                )}
              </div>
              <h4 className="font-medium text-sm">{s.title}</h4>
              <p className="text-xs text-muted-foreground">{s.description}</p>
              {s.codeSnippet && (
                <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
                  <code>{s.codeSnippet}</code>
                </pre>
              )}
              {s.improvedCode && (
                <div>
                  <p className="text-xs text-green-400 mb-1">Suggested Fix:</p>
                  <pre className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-xs overflow-x-auto">
                    <code>{s.improvedCode}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="gradient" asChild>
          <Link href="/dashboard/suggestions">
            <Lightbulb className="w-4 h-4 mr-2" />
            Review & Implement Suggestions
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/documentation">
            <FileText className="w-4 h-4 mr-2" />
            View Documentation
          </Link>
        </Button>
      </div>
    </div>
  );
}

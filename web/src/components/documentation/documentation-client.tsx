"use client";

import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Search,
  Download,
  Share2,
  Eye,
  Code2,
  BookOpen,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  format: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  analysis: { id: string; title: string; language: string | null } | null;
}

const docTypeIcons: Record<string, any> = {
  TECHNICAL: Code2,
  USER_GUIDE: BookOpen,
  API_REFERENCE: FileText,
  ARCHITECTURE: FileText,
  CHANGELOG: Clock,
};

const docTypeColors: Record<string, string> = {
  TECHNICAL: "text-blue-400",
  USER_GUIDE: "text-green-400",
  API_REFERENCE: "text-purple-400",
  ARCHITECTURE: "text-yellow-400",
  CHANGELOG: "text-pink-400",
};

export function DocumentationClient({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Debounce search so we don't scan all content on every keystroke
  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return documents;
    const q = debouncedSearch.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.content.slice(0, 500).toLowerCase().includes(q)
    );
  }, [documents, debouncedSearch]);

  const renderMarkdown = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mb-4 mt-6">{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold mb-3 mt-5">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-medium mb-2 mt-4">{line.slice(4)}</h3>;
        if (line.startsWith("- ")) return <li key={i} className="ml-4 mb-1 text-sm">{line.slice(2)}</li>;
        if (line.startsWith("**") && line.endsWith("**")) return <strong key={i} className="font-semibold">{line.slice(2, -2)}</strong>;
        if (line.startsWith("---")) return <hr key={i} className="border-border my-4" />;
        if (line.trim() === "") return <br key={i} />;
        return <p key={i} className="text-sm mb-2 text-muted-foreground">{line}</p>;
      });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">
            Auto-generated technical docs from your analyses and implementations.
          </p>
        </div>
        <Button variant="gradient" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Doc
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Doc list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">No documentation yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Documentation is auto-generated when you run analyses
          </p>
          <Button variant="gradient" size="sm" className="mt-4" asChild>
            <Link href="/dashboard/analyze">Run Analysis</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const Icon = docTypeIcons[doc.type] || FileText;
            const color = docTypeColors[doc.type] || "text-muted-foreground";
            return (
              <Card
                key={doc.id}
                className="border-border/50 hover:border-border transition-all card-hover cursor-pointer"
                onClick={() => { setSelectedDoc(doc); setViewOpen(true); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">{doc.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.type.replace("_", " ")}
                        </Badge>
                        {doc.isPublic && (
                          <Badge variant="success" className="text-xs">Public</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                    {doc.content.slice(0, 150).replace(/[#*`]/g, "")}...
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(doc.createdAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); setViewOpen(true); }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Document viewer dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <DialogTitle>{selectedDoc?.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            {selectedDoc?.analysis && (
              <p className="text-xs text-muted-foreground">
                From analysis: {selectedDoc.analysis.title}
              </p>
            )}
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4">
            <div className="prose prose-invert max-w-none pr-4">
              {selectedDoc && renderMarkdown(selectedDoc.content)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

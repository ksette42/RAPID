"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export function ApiKeysClient({ apiKeys: initialKeys }: { apiKeys: ApiKey[] }) {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState(initialKeys);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setLoading("create");
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      setNewKey(data.key);
      setApiKeys((prev) => [data, ...prev]);
      setNewKeyName("");
      setCreating(false);
      toast({
        title: "API Key Created",
        description: "Copy your key now — it won't be shown again.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to create API key.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast({ title: "API Key Deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete key.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "API key copied to clipboard." });
  };

  const maskKey = (key: string) => {
    return key.slice(0, 8) + "••••••••••••••••" + key.slice(-4);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for programmatic access to RAPID.
          </p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Key
        </Button>
      </div>

      {/* New key form */}
      {creating && (
        <Card className="border-rapid-500/30 bg-rapid-500/5">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input
                placeholder="e.g. production-server"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="gradient"
                size="sm"
                onClick={handleCreate}
                disabled={loading === "create" || !newKeyName.trim()}
              >
                {loading === "create" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                Create Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCreating(false); setNewKeyName(""); }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newly created key - show once */}
      {newKey && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-400 mb-2">
              ✓ New API Key — Copy it now, it won't be shown again
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background rounded px-3 py-2 text-sm font-mono break-all">
                {newKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(newKey)}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => setNewKey(null)}
            >
              I've copied my key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Keys list */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Your API Keys</CardTitle>
          <CardDescription>
            Use these keys to authenticate API requests to RAPID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-10">
              <Key className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No API keys yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setCreating(true)}>
                Create your first key
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {apiKeys.map((key) => (
                <div key={key.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-sm">{key.name}</span>
                        <Badge variant="success" className="text-xs">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <code className="text-xs text-muted-foreground font-mono">
                          {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                        </code>
                        <button
                          onClick={() => setVisibleKeys(prev => {
                            const next = new Set(prev);
                            next.has(key.id) ? next.delete(key.id) : next.add(key.id);
                            return next;
                          })}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {visibleKeys.has(key.id)
                            ? <EyeOff className="w-3 h-3" />
                            : <Eye className="w-3 h-3" />
                          }
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {formatDate(key.createdAt)}
                        {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(key.id)}
                      disabled={loading === key.id}
                    >
                      {loading === key.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage docs */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">API Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Include your API key in the Authorization header:</p>
          <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
            <code>{`curl -X POST https://api.rapid.dev/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "your code here", "type": "CODE"}'`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

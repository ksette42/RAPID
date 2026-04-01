import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Terminal, Monitor, Code2, Container, Github, Zap,
  Apple, Chrome, Download, ArrowRight, CheckCircle2, Copy,
} from "lucide-react";

export const metadata = { title: "Download RAPID" };

const downloads = [
  {
    id: "cli",
    name: "RAPID CLI",
    tagline: "Run on-demand from any terminal",
    icon: Terminal,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    badge: "npm",
    badgeVariant: "info" as const,
    description: "Install globally with npm and analyze any file, directory, or piped input from your terminal. Works on macOS, Windows, and Linux.",
    install: "npm install -g @rapid-dev/cli",
    steps: [
      "Install: npm install -g @rapid-dev/cli",
      "Authenticate: rapid login",
      "Analyze: rapid analyze src/api.ts",
      "Scan a project: rapid scan ./src",
    ],
    cta: "View CLI Docs",
    href: "https://github.com/rapid-dev/rapid/tree/main/cli",
    commands: [
      { label: "Install", code: "npm install -g @rapid-dev/cli" },
      { label: "Analyze file", code: "rapid analyze src/api.ts" },
      { label: "Scan project", code: "rapid scan ./src --output markdown" },
      { label: "View history", code: "rapid history" },
    ],
  },
  {
    id: "desktop",
    name: "Desktop App",
    tagline: "Native app for macOS, Windows & Linux",
    icon: Monitor,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    badge: "Electron",
    badgeVariant: "purple" as const,
    description: "A full native desktop experience. Drag and drop files, open from Finder/Explorer, system tray access, and export reports — all without a browser.",
    steps: [
      "Download the installer for your OS",
      "Install and open RAPID",
      "Enter your API key from the dashboard",
      "Drag files or use File → Open to analyze",
    ],
    downloads: [
      { os: "macOS", arch: "Apple Silicon", ext: ".dmg", icon: "🍎" },
      { os: "macOS", arch: "Intel", ext: ".dmg", icon: "🍎" },
      { os: "Windows", arch: "x64", ext: ".exe", icon: "🪟" },
      { os: "Linux", arch: "x64", ext: ".AppImage", icon: "🐧" },
    ],
    cta: "Build from Source",
    href: "https://github.com/rapid-dev/rapid/tree/main/desktop",
  },
  {
    id: "vscode",
    name: "VS Code Extension",
    tagline: "Analyze files without leaving your editor",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "VS Code",
    badgeVariant: "info" as const,
    description: "Right-click any file or selection to instantly analyze it. Results appear in a side panel. Supports auto-analyze on save and inline suggestions.",
    steps: [
      "Search \"RAPID\" in VS Code Extensions",
      "Install and reload VS Code",
      "Cmd/Ctrl+Shift+P → RAPID: Set API Key",
      "Cmd/Ctrl+Shift+R to analyze any file",
    ],
    cta: "Install from Marketplace",
    href: "https://marketplace.visualstudio.com/items?itemName=rapid-dev.rapid-vscode",
    commands: [
      { label: "Keyboard shortcut", code: "Cmd/Ctrl+Shift+R" },
      { label: "Right-click", code: "RAPID: Analyze Current File" },
      { label: "Command Palette", code: "RAPID: Scan Workspace" },
    ],
  },
  {
    id: "docker",
    name: "Self-Hosted Docker",
    tagline: "Run RAPID entirely on your own infrastructure",
    icon: Container,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    badge: "Docker",
    badgeVariant: "success" as const,
    description: "Run the full RAPID stack — web app and PostgreSQL — on your own server. Full data privacy, no external dependencies.",
    steps: [
      "Copy .env.docker.example to .env and fill in values",
      "Run: docker compose up -d",
      "Open http://localhost:3000",
      "Create your account and start analyzing",
    ],
    cta: "Docker Hub",
    href: "https://hub.docker.com/r/rapiddev/rapid",
    commands: [
      { label: "Quick start", code: "docker compose up -d" },
      { label: "Pull image", code: "docker pull rapiddev/rapid:latest" },
      { label: "Check logs", code: "docker compose logs -f web" },
    ],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    tagline: "Automatic analysis on every PR and push",
    icon: Github,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "CI/CD",
    badgeVariant: "warning" as const,
    description: "Add RAPID to your CI pipeline. Automatically analyze changed files on every PR, post results as a comment, and track improvements over time.",
    steps: [
      "Add RAPID_API_KEY to GitHub repo secrets",
      "Copy the workflow YAML to .github/workflows/",
      "Push to your repo — RAPID runs automatically",
      "See analysis results in PR comments and Actions",
    ],
    cta: "View Workflow Template",
    href: "https://github.com/rapid-dev/rapid/tree/main/.github/workflows",
    commands: [
      { label: "Secrets needed", code: "RAPID_API_KEY, RAPID_API_URL (optional)" },
      { label: "Triggers", code: "push, pull_request, workflow_dispatch" },
    ],
  },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <Badge variant="info" className="mb-4">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download & Install
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Run RAPID <span className="text-gradient">anywhere</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use RAPID from your terminal, desktop, code editor, CI/CD pipeline, or
            self-hosted on your own infrastructure.
          </p>
        </section>

        {/* Downloads grid */}
        <section className="container mx-auto px-4 space-y-8">
          {downloads.map((item) => (
            <Card key={item.id} className={`border ${item.border} bg-card/50`} id={item.id}>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left: info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold">{item.name}</h2>
                          <Badge variant={item.badgeVariant} className="text-xs">{item.badge}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.tagline}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">{item.description}</p>

                    {/* Steps */}
                    <div className="space-y-2 mb-6">
                      {item.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full ${item.bg} ${item.color} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={item.href} target="_blank">
                        {item.cta}
                        <ArrowRight className="ml-2 w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Right: install/download */}
                  <div className="space-y-4">
                    {/* Desktop download buttons */}
                    {item.downloads && (
                      <div>
                        <p className="text-sm font-medium mb-3">Download installer:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {item.downloads.map((dl, i) => (
                            <Button key={i} variant="outline" size="sm" className="justify-start gap-2" asChild>
                              <Link href="#">
                                <span>{dl.icon}</span>
                                <span className="text-xs">
                                  <span className="font-medium">{dl.os}</span>
                                  <span className="text-muted-foreground"> {dl.arch} {dl.ext}</span>
                                </span>
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Install command */}
                    {item.install && (
                      <div>
                        <p className="text-sm font-medium mb-2">Install:</p>
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3 font-mono text-sm border border-border/50">
                          <span className="text-rapid-400">$</span>
                          <span className="flex-1">{item.install}</span>
                        </div>
                      </div>
                    )}

                    {/* Commands */}
                    {item.commands && (
                      <div>
                        <p className="text-sm font-medium mb-2">Usage:</p>
                        <div className="space-y-2">
                          {item.commands.map((cmd, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg px-4 py-2.5 border border-border/50">
                              <div className="text-xs text-muted-foreground mb-1">{cmd.label}</div>
                              <code className="text-xs font-mono text-foreground">{cmd.code}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* All in one */}
        <section className="container mx-auto px-4 mt-16">
          <Card className="border-rapid-500/30 bg-gradient-to-r from-rapid-900/30 to-purple-900/20">
            <CardContent className="p-8 text-center">
              <Zap className="w-10 h-10 text-rapid-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">All methods use the same account</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Whether you use the web app, CLI, desktop app, VS Code extension, or GitHub Actions —
                everything syncs to your RAPID account. One API key, all tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="gradient" asChild>
                  <Link href="/auth/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/api-keys">Get API Key</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Code2,
  ShieldCheck,
  BarChart3,
  GitMerge,
  FileText,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Code2,
    title: "Analyze any language",
    description:
      "Paste or upload JavaScript, Python, Go, Rust, Java, SQL, YAML, JSON, Terraform, Markdown, and more.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Works with any data",
    description:
      "Review source code, API specs, dashboards, schemas, logs, config files, and structured text in one place.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Sparkles,
    title: "Clear findings",
    description:
      "Get concise findings grouped by performance, reliability, security, maintainability, and scale.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Helpful scores",
    description:
      "See easy-to-read reliability and performance scores so you can quickly understand the state of the input.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: GitMerge,
    title: "Review before change",
    description:
      "Generated fixes stay permission-based, so you can inspect the suggested code before applying anything.",
    color: "text-rapid-400",
    bg: "bg-rapid-500/10",
  },
  {
    icon: FileText,
    title: "Reports included",
    description:
      "Each analysis can create a lightweight report you can revisit, search, and share with your team.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
];

const stats = [
  { label: "Languages & formats", value: "50+", icon: Code2 },
  { label: "Typical analysis time", value: "<30s", icon: Zap },
  { label: "Core review scores", value: "2", icon: ShieldCheck },
  { label: "Supported input types", value: "6", icon: BarChart3 },
];

const steps = [
  {
    step: "1",
    label: "Add your input",
    desc: "Upload a file or paste code, config, schema, logs, or any text-based data.",
    icon: Code2,
    color: "bg-blue-500",
  },
  {
    step: "2",
    label: "Run analysis",
    desc: "RAPID detects the language or data type and reviews it for useful patterns and issues.",
    icon: Cpu,
    color: "bg-purple-500",
  },
  {
    step: "3",
    label: "Review findings",
    desc: "Explore prioritized findings, scores, and suggested improvements in a clean dashboard.",
    icon: Sparkles,
    color: "bg-yellow-500",
  },
  {
    step: "4",
    label: "Document or implement",
    desc: "Save the report, share it, or inspect suggested code changes before applying them.",
    icon: FileText,
    color: "bg-pink-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-rapid-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <Badge variant="info" className="mb-6 text-sm px-4 py-1.5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Simple AI analysis for any code or data
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient">RAPID</span>
            <br />
            <span className="text-foreground/90 text-4xl lg:text-5xl">
              Analyze any code or data with clarity
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            RAPID is a clean workspace for analyzing source code, schemas, dashboards, APIs, and
            general data. Paste text or upload a file, review clear findings, and keep suggested
            changes and documentation in one simple flow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/auth/signup">
                Open the App
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/dashboard/analyze">Start Analyzing</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Upload or paste input
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Works across many languages
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Clear review workflow
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-rapid-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="purple" className="mb-4">Features</Badge>
          <h2 className="text-4xl font-bold mb-4">
            A focused workflow that stays easy to use
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            RAPID keeps the experience simple: analyze the input, understand the findings,
            and decide what to do next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-2`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">A simple four-step analysis flow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {steps.map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute translate-x-36 w-5 h-5 text-muted-foreground mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-rapid-900/50 via-purple-900/30 to-rapid-900/50 border-y border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to analyze your data?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Open RAPID, add your input, and review clear findings in a focused workspace.
          </p>
          <Button variant="gradient" size="xl" asChild>
            <Link href="/dashboard/analyze">
              Go to Analyze
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

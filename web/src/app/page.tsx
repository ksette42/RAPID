import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Code2,
  TrendingDown,
  ShieldCheck,
  BarChart3,
  GitMerge,
  FileText,
  ArrowRight,
  CheckCircle2,
  Star,
  Cpu,
  Database,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Code2,
    title: "Universal Code Reader",
    description:
      "Analyzes any programming language — Python, JavaScript, Go, Rust, Java, SQL, Terraform, and 50+ more.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard Intelligence",
    description:
      "Reads and analyzes dashboards, metrics, and data patterns to surface hidden performance bottlenecks.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: TrendingDown,
    title: "Cost Savings Engine",
    description:
      "Identifies redundant queries, inefficient loops, and over-provisioned resources to slash your cloud bill.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Reliability Improvements",
    description:
      "Detects single points of failure, race conditions, and architectural weaknesses before they hit production.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: GitMerge,
    title: "Permissioned Implementation",
    description:
      "Every suggested change requires your explicit approval. RAPID implements patches only when you say go.",
    color: "text-rapid-400",
    bg: "bg-rapid-500/10",
  },
  {
    icon: FileText,
    title: "Auto Documentation",
    description:
      "Generates technical docs, API references, and architecture diagrams automatically from your codebase.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
];

const stats = [
  { label: "Average Cost Reduction", value: "34%", icon: TrendingDown },
  { label: "Languages Supported", value: "50+", icon: Code2 },
  { label: "Uptime Improvement", value: "99.9%", icon: ShieldCheck },
  { label: "Analysis Speed", value: "<30s", icon: Zap },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small projects",
    features: [
      "5 analyses per month",
      "Basic code analysis",
      "10 suggestions per analysis",
      "Community support",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For teams that ship fast and need reliability",
    features: [
      "Unlimited analyses",
      "All language support",
      "Dashboard analysis",
      "One-click implementation",
      "Auto-documentation",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For organizations requiring compliance and scale",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "On-premise deployment",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated engineer",
      "Audit logs",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
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
            AI-Powered Code & Data Intelligence
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient">RAPID</span>
            <br />
            <span className="text-foreground/90 text-4xl lg:text-5xl">
              Read · Analyze · Patch · Implement · Document
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            RAPID analyzes any code, database schema, or dashboard to surface
            actionable improvements focused on{" "}
            <span className="text-green-400 font-medium">cost savings</span> and{" "}
            <span className="text-blue-400 font-medium">reliability</span> —
            then implements them with your permission.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Free tier forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Setup in 2 minutes
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
            Everything you need to optimize your systems
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From reading legacy COBOL to modern microservices, RAPID understands
            your stack and tells you exactly what to fix.
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
            <h2 className="text-4xl font-bold mb-4">Five steps to a faster, cheaper system</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { step: "R", label: "Read", desc: "Upload code, paste snippets, or connect your repo", icon: Code2, color: "bg-blue-500" },
              { step: "A", label: "Analyze", desc: "AI engine scans for inefficiencies and patterns", icon: Cpu, color: "bg-purple-500" },
              { step: "P", label: "Patch", desc: "Generates precise fixes with before/after diffs", icon: GitMerge, color: "bg-yellow-500" },
              { step: "I", label: "Implement", desc: "Apply changes with a single click after your review", icon: Zap, color: "bg-green-500" },
              { step: "D", label: "Document", desc: "Auto-generates docs for every change made", icon: FileText, color: "bg-pink-500" },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < 4 && (
                  <ArrowRight className="hidden md:block absolute translate-x-32 w-5 h-5 text-muted-foreground mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 container mx-auto px-4" id="pricing">
        <div className="text-center mb-16">
          <Badge variant="warning" className="mb-4">Pricing</Badge>
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start free. Scale as you grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-rapid-500 shadow-xl shadow-rapid-500/20 scale-105"
                  : "border-border/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-rapid-500 text-white px-4">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "gradient" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-rapid-900/50 via-purple-900/30 to-rapid-900/50 border-y border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to optimize your systems?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of engineers using RAPID to cut costs and improve reliability.
          </p>
          <Button variant="gradient" size="xl" asChild>
            <Link href="/auth/signup">
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

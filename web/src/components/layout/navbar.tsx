"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Code2,
  FileText,
  Sparkles,
  BarChart3,
  GitMerge,
  ArrowRight,
} from "lucide-react";

const featuresMenu = [
  {
    label: "Analyze",
    description: "Analyze code, data, dashboards, or any uploaded file including screenshots",
    href: "/dashboard/analyze",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Document",
    description: "Auto-generate technical documentation from your code and analyses",
    href: "/dashboard/documentation",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Enhance & Improve",
    description: "Get AI-powered suggestions to improve any data, document, code, or screenshot",
    href: "/dashboard/suggestions",
    icon: Sparkles,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

const allFeatures = [
  { label: "Analytics Dashboard", href: "/dashboard/analytics", icon: BarChart3, color: "text-green-400" },
  { label: "Implementation", href: "/dashboard/implementation", icon: GitMerge, color: "text-rapid-400" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-rapid-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">RAPID</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">

            {/* Features dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
                />
              </button>

              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 p-4 animate-fade-in">
                  {/* Triangle pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
                    <div className="w-3 h-3 bg-card border-l border-t border-border/60 rotate-45 translate-y-1 mx-auto" />
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                    Core Features
                  </p>

                  {/* Main 3 features */}
                  <div className="grid grid-cols-1 gap-1 mb-4">
                    {featuresMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setFeaturesOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-accent/60 transition-all"
                      >
                        <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50 pt-3 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                      More Tools
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {allFeatures.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setFeaturesOpen(false)}
                          className="group flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent/60 transition-all"
                        >
                          <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div className="border-t border-border/50 pt-3 mt-1 flex items-center justify-between px-1">
                    <p className="text-xs text-muted-foreground">
                      All features available from the dashboard
                    </p>
                    <Link
                      href="/dashboard"
                      onClick={() => setFeaturesOpen(false)}
                      className="text-xs text-rapid-400 hover:text-rapid-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      Open Dashboard
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/download" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Download
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="text-xs">
                    {session.user.plan || "FREE"}
                  </Badge>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? ""} />
                    <AvatarFallback className="bg-rapid-500 text-white text-xs">
                      {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background px-4 py-4 space-y-1">
          {/* Features section */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-1 pb-2">
            Features
          </p>
          {featuresMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-colors"
            >
              <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          {allFeatures.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className={`w-4 h-4 ${item.color} ml-1`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </Link>
          ))}

          <div className="border-t border-border/50 pt-3 mt-3 space-y-1">
            <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm text-muted-foreground">Pricing</Link>
            <Link href="/download" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm text-muted-foreground">Download</Link>
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm text-muted-foreground">Docs</Link>
          </div>

          <div className="border-t border-border/50 pt-3 mt-3">
            {session ? (
              <div className="space-y-1">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm font-medium">Dashboard</Link>
                <button onClick={() => signOut()} className="block px-2 py-2 text-sm text-red-400 w-full text-left">Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild><Link href="/auth/signin">Sign In</Link></Button>
                <Button variant="gradient" size="sm" asChild><Link href="/auth/signup">Get Started</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

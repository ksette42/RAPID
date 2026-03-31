"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-rapid-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">RAPID</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
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
        <div className="md:hidden border-t border-border/50 bg-background px-4 py-4 space-y-3">
          <Link href="/#features" className="block text-sm text-muted-foreground">Features</Link>
          <Link href="/#pricing" className="block text-sm text-muted-foreground">Pricing</Link>
          <Link href="/download" className="block text-sm text-muted-foreground">Download</Link>
          <Link href="/docs" className="block text-sm text-muted-foreground">Docs</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block text-sm">Dashboard</Link>
              <button onClick={() => signOut()} className="block text-sm text-red-400">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" asChild><Link href="/auth/signin">Sign In</Link></Button>
              <Button variant="gradient" size="sm" asChild><Link href="/auth/signup">Get Started</Link></Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

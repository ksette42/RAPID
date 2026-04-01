"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Settings, CreditCard, User } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session } = useSession();

  const planColors: Record<string, string> = {
    FREE: "secondary",
    STARTER: "info",
    PRO: "purple",
    ENTERPRISE: "warning",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
      <div className="flex items-center justify-between">
        <div />

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rapid-500 rounded-full" />
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant={(planColors[session?.user?.plan ?? "FREE"] as any) || "secondary"} className="text-xs">
              {session?.user?.plan ?? "FREE"}
            </Badge>

            <div className="flex items-center gap-2 pl-2 border-l border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session?.user?.email}
                </p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback className="bg-rapid-500 text-white text-xs">
                  {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  Lightbulb,
  GitMerge,
  FileText,
  Settings,
  Zap,
  CreditCard,
  BarChart3,
  Key,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Analyze",
    href: "/dashboard/analyze",
    icon: Code2,
    badge: "Core",
  },
  {
    title: "Suggestions",
    href: "/dashboard/suggestions",
    icon: Lightbulb,
  },
  {
    title: "Implement",
    href: "/dashboard/implementation",
    icon: GitMerge,
  },
  {
    title: "Documents",
    href: "/dashboard/documentation",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const bottomItems = [
  {
    title: "API Keys",
    href: "/dashboard/api-keys",
    icon: Key,
  },
  {
    title: "Download",
    href: "/download",
    icon: Globe,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden" />

      <aside
        className={cn(
          "fixed left-0 top-0 h-full border-r border-border/50 bg-card/50 backdrop-blur-xl z-50 transition-all duration-200 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-2 p-4 border-b border-border/50", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-gradient-to-br from-rapid-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-xl text-gradient">RAPID</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive(item.href, item.exact)
                  ? "bg-rapid-500/20 text-rapid-400 border border-rapid-500/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="info" className="text-xs py-0 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="p-3 space-y-1 border-t border-border/50">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive(item.href)
                  ? "bg-rapid-500/20 text-rapid-400 border border-rapid-500/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

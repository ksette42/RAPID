import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RAPID - Read, Analyze, Patch, Implement & Document",
    template: "%s | RAPID",
  },
  description:
    "RAPID analyzes your code, data, and dashboards to suggest cost-saving and reliability improvements — then implements them with your permission.",
  keywords: [
    "code analysis",
    "performance optimization",
    "cost savings",
    "reliability",
    "AI-powered",
    "code review",
  ],
  authors: [{ name: "RAPID Team" }],
  creator: "RAPID",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "RAPID - AI-Powered Code & Data Analysis",
    description:
      "Analyze any code or data pattern, get actionable improvement suggestions focused on cost savings and reliability.",
    siteName: "RAPID",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAPID - AI-Powered Code & Data Analysis",
    description:
      "Analyze any code or data pattern, get actionable improvement suggestions focused on cost savings and reliability.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

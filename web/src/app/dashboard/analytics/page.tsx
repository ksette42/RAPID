import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsClient } from "@/components/analytics/analytics-client";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  const [analyses, suggestions, implementations] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "asc" },
      take: 200,
      select: {
        id: true,
        createdAt: true,
        status: true,
        type: true,
        costSavings: true,
        reliabilityScore: true,
        performanceScore: true,
        language: true,
      },
    }),
    prisma.suggestion.findMany({
      where: { analysis: { userId: session!.user.id } },
      take: 500,
      select: { category: true, status: true, priority: true, estimatedSaving: true },
    }),
    prisma.implementation.findMany({
      where: { analysis: { userId: session!.user.id } },
      take: 200,
      select: { status: true, createdAt: true },
    }),
  ]);

  return (
    <AnalyticsClient
      analyses={analyses}
      suggestions={suggestions}
      implementations={implementations}
    />
  );
}

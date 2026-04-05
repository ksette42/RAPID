import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyzeClient } from "@/components/analyzer/analyze-client";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Analyze" };

export default async function AnalyzePage() {
  const session = await getServerSession(authOptions);

  const analyses = await prisma.analysis.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      suggestions: { select: { id: true, status: true, estimatedSaving: true } },
    },
    take: 20,
  });

  return <AnalyzeClient analyses={analyses} />;
}

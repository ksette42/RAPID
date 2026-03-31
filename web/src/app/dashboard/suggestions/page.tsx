import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SuggestionsClient } from "@/components/suggestions/suggestions-client";

export const metadata = { title: "Suggestions" };

export default async function SuggestionsPage() {
  const session = await getServerSession(authOptions);

  const suggestions = await prisma.suggestion.findMany({
    where: { analysis: { userId: session!.user.id } },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    include: {
      analysis: { select: { id: true, title: true, language: true } },
    },
  });

  return <SuggestionsClient suggestions={suggestions} />;
}

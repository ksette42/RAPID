import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentationClient } from "@/components/documentation/documentation-client";

export const metadata = { title: "Documentation" };

export default async function DocumentationPage() {
  const session = await getServerSession(authOptions);

  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, type: true, format: true,
      isPublic: true, createdAt: true, updatedAt: true,
      // Only fetch a preview snippet — full content loaded on demand when dialog opens
      content: true,
      analysis: { select: { id: true, title: true, language: true } },
    },
  });

  return <DocumentationClient documents={documents} />;
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/request-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json();

  const suggestion = await prisma.suggestion.findFirst({
    where: {
      id: params.id,
      analysis: { userId: user.id },
    },
  });

  if (!suggestion) {
    return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
  }

  const statusMap: Record<string, string> = {
    approve: "APPROVED",
    dismiss: "DISMISSED",
    reject: "REJECTED",
    implement: "IMPLEMENTED",
  };

  const newStatus = statusMap[action];
  if (!newStatus) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.suggestion.update({
    where: { id: params.id },
    data: { status: newStatus as any },
  });

  // If implementing, create an implementation record
  if (action === "implement") {
    await prisma.implementation.upsert({
      where: { suggestionId: params.id },
      create: {
        analysisId: suggestion.analysisId,
        suggestionId: params.id,
        title: suggestion.title,
        description: suggestion.description,
        status: "APPROVED",
        approvedAt: new Date(),
        appliedAt: new Date(),
        appliedCode: suggestion.improvedCode,
        originalCode: suggestion.codeSnippet,
      },
      update: {
        status: "COMPLETED",
        appliedAt: new Date(),
      },
    });
  }

  return NextResponse.json(updated);
}

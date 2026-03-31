import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json();

  const implementation = await prisma.implementation.findFirst({
    where: {
      id: params.id,
      analysis: { userId: session.user.id },
    },
  });

  if (!implementation) {
    return NextResponse.json({ error: "Implementation not found" }, { status: 404 });
  }

  let newStatus: string;
  let updateData: any = {};

  switch (action) {
    case "approve":
      newStatus = "APPROVED";
      updateData.approvedAt = new Date();
      break;
    case "apply":
      newStatus = "COMPLETED";
      updateData.appliedAt = new Date();
      break;
    case "rollback":
      newStatus = "ROLLED_BACK";
      updateData.rollbackAt = new Date();
      // If rolling back, update suggestion status too
      if (implementation.suggestionId) {
        await prisma.suggestion.update({
          where: { id: implementation.suggestionId },
          data: { status: "PENDING" },
        });
      }
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.implementation.update({
    where: { id: params.id },
    data: { status: newStatus as any, ...updateData },
  });

  return NextResponse.json(updated);
}

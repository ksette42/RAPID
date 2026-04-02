import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedRequestUser {
  id: string;
  authMethod: "session" | "apiKey";
}

export async function getRequestUser(
  req: NextRequest
): Promise<AuthenticatedRequestUser | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return { id: session.user.id, authMethod: "session" };
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;

  if (!token) return null;

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: token },
    select: { userId: true },
  });

  if (!apiKey) return null;

  void prisma.apiKey.updateMany({
    where: { key: token },
    data: { lastUsed: new Date() },
  });

  return { id: apiKey.userId, authMethod: "apiKey" };
}

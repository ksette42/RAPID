import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  // Check limit (max 10 keys)
  const count = await prisma.apiKey.count({ where: { userId: session.user.id } });
  if (count >= 10) {
    return NextResponse.json({ error: "Maximum 10 API keys allowed" }, { status: 400 });
  }

  const key = `rapid_${crypto.randomBytes(32).toString("hex")}`;

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      key,
    },
  });

  return NextResponse.json(apiKey, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(keys);
}

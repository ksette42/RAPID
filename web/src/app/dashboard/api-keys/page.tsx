import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiKeysClient } from "@/components/api-keys/api-keys-client";

export const metadata = { title: "API Keys" };

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return <ApiKeysClient apiKeys={apiKeys} />;
}

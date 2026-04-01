import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImplementationClient } from "@/components/implementation/implementation-client";

export const metadata = { title: "Implementation" };

export default async function ImplementationPage() {
  const session = await getServerSession(authOptions);

  const implementations = await prisma.implementation.findMany({
    where: { analysis: { userId: session!.user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      analysis: { select: { id: true, title: true, language: true } },
      suggestion: {
        select: {
          title: true,
          category: true,
          priority: true,
          estimatedSaving: true,
          codeSnippet: true,
          improvedCode: true,
        },
      },
    },
  });

  return <ImplementationClient implementations={implementations} />;
}

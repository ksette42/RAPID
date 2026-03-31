import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BillingClient } from "@/components/billing/billing-client";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session!.user.id },
  });

  return <BillingClient subscription={subscription} />;
}

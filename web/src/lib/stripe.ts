import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    analyses: 5,
  },
  STARTER: {
    name: "Starter",
    price: 900,
    analyses: 50,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  PRO: {
    name: "Pro",
    price: 2900,
    analyses: -1, // unlimited
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 9900,
    analyses: -1,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
};

export function getPlanFromPriceId(priceId: string): string {
  for (const [plan, details] of Object.entries(PLANS)) {
    if ((details as any).priceId === priceId) return plan;
  }
  return "FREE";
}

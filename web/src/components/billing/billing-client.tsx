"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  CheckCircle2,
  Star,
  Zap,
  Building2,
  ArrowRight,
  Loader2,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  createdAt: Date;
}

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    priceId: null,
    description: "Perfect for individuals",
    icon: Zap,
    features: [
      "5 analyses per month",
      "Basic code analysis",
      "10 suggestions per analysis",
      "Community support",
      "Documentation generation",
    ],
    limits: "5 analyses/month",
  },
  {
    id: "STARTER",
    name: "Starter",
    price: 9,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    description: "For growing projects",
    icon: Star,
    features: [
      "50 analyses per month",
      "All language support",
      "Unlimited suggestions",
      "Email support",
      "API access",
      "Priority processing",
    ],
    limits: "50 analyses/month",
  },
  {
    id: "PRO",
    name: "Pro",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    description: "For teams that ship fast",
    icon: Star,
    features: [
      "Unlimited analyses",
      "All language support",
      "Dashboard analysis",
      "One-click implementation",
      "Auto-documentation",
      "Priority support",
      "API access",
      "Team collaboration",
    ],
    limits: "Unlimited",
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    description: "For organizations",
    icon: Building2,
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "On-premise option",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated support",
      "Audit logs",
      "Custom contracts",
    ],
    limits: "Unlimited + Enterprise features",
  },
];

export function BillingClient({ subscription }: { subscription: Subscription | null }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const currentPlan = subscription?.plan ?? "FREE";

  const handleSubscribe = async (planId: string, priceId: string | null | undefined) => {
    if (!priceId) {
      toast({ title: "Contact Sales", description: "Please contact sales for Enterprise pricing." });
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch {
      toast({ title: "Error", description: "Failed to start checkout. Please try again.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Error", description: "Failed to open billing portal.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      {/* Current Plan */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{currentPlan}</span>
                <Badge variant={currentPlan === "FREE" ? "secondary" : "success"}>
                  {subscription?.status ?? "ACTIVE"}
                </Badge>
              </div>
              {subscription?.stripeCurrentPeriodEnd && (
                <p className="text-sm text-muted-foreground mt-1">
                  Renews on {formatDate(subscription.stripeCurrentPeriodEnd)}
                </p>
              )}
            </div>
            {currentPlan !== "FREE" && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={loading === "manage"}
              >
                {loading === "manage" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                Manage Billing
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Shield className="w-4 h-4 text-green-400" />
            <p className="text-xs text-muted-foreground">
              Payments are processed securely via Stripe. RAPID never stores your card details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isPopular = (plan as any).popular;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isPopular
                    ? "border-rapid-500 shadow-lg shadow-rapid-500/10"
                    : isCurrent
                    ? "border-green-500/50"
                    : "border-border/50"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-rapid-500 text-white text-xs px-3">
                      <Star className="w-2.5 h-2.5 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-2.5 right-4">
                    <Badge variant="success" className="text-xs px-3">
                      Current
                    </Badge>
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="mb-4">
                    <p className="font-semibold text-lg">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.price === 0 ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Free Forever
                    </Button>
                  ) : (
                    <Button
                      variant={isPopular ? "gradient" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id, plan.priceId)}
                      disabled={!!loading}
                    >
                      {loading === plan.id ? (
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                      ) : null}
                      {plan.id === "ENTERPRISE" ? "Contact Sales" : `Upgrade to ${plan.name}`}
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

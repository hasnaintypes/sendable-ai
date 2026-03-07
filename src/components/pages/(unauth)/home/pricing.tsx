"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and solo professionals",
    price: { monthly: 0, yearly: 0 },
    features: [
      "50 emails per month",
      "Basic AI generation",
      "2 connected inboxes",
      "Email templates",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For sales teams and active recruiters",
    price: { monthly: 49, yearly: 39 },
    features: [
      "Unlimited emails per month",
      "Advanced AI personalization",
      "Unlimited connected inboxes",
      "Audience research & enrichment",
      "Follow-up sequences",
      "Template library",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: { monthly: 199, yearly: 159 },
    features: [
      "Everything in Professional",
      "Custom AI training",
      "Dedicated account manager",
      "Advanced analytics & reporting",
      "SSO & SAML",
      "Custom integrations",
      "SLA guarantee",
      "Audit logs",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

function BorderBeam() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
      <div
        className="absolute w-24 h-24 bg-primary-foreground/20 blur-xl border-beam"
        style={{
          offsetPath: "rect(0 100% 100% 0 round 16px)",
        }}
      />
    </div>
  );
}

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-sans">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free with 50 emails per month. Scale as you grow. No hidden
            fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-secondary border border-border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                plan.highlighted
                  ? "bg-card border-border"
                  : "bg-card/50 border-border hover:border-muted-foreground/30"
              }`}
            >
              {plan.highlighted && <BorderBeam />}

              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price[billingCycle]}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground text-sm">/month</span>
                  )}
                </div>
                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed annually (${plan.price.yearly * 12}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground/80"
                  >
                    <Check
                      className="w-4 h-4 text-primary shrink-0"
                      strokeWidth={1.5}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full ${
                  plan.highlighted
                    ? "shimmer-btn bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-accent border border-border"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

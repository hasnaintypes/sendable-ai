import { defineTable } from "convex/server";
import { v } from "convex/values";
import { tables } from "../betterAuth/generatedSchema";

export const usersTables = {
  user: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.string(),
    username: v.optional(v.union(v.null(), v.string())),
    image: v.optional(v.union(v.null(), v.string())),
    plan: v.optional(
      v.union(v.literal("free"), v.literal("pro"), v.literal("growth"))
    ),
    stripeCustomerId: v.optional(v.union(v.null(), v.string())),
    stripeSubscriptionId: v.optional(v.union(v.null(), v.string())),
    subscriptionStatus: v.optional(
      v.union(
        v.null(),
        v.literal("active"),
        v.literal("past_due"),
        v.literal("canceled"),
        v.literal("trialing")
      )
    ),
    twoFactorEnabled: v.optional(v.union(v.null(), v.boolean())),
    createdAt: v.optional(v.float64()),
    updatedAt: v.optional(v.float64()),
  })
    .index("email", ["email"])
    .index("username", ["username"])
    .index("stripeCustomerId", ["stripeCustomerId"])
    .index("plan", ["plan"]),
  account: tables.account,
  session: tables.session,
  verification: tables.verification,
  twoFactor: tables.twoFactor,
  jwks: tables.jwks,
};

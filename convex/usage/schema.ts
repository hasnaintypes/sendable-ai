import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usageTables = {
  usageCounters: defineTable({
    userId: v.string(),
    period: v.string(),
    campaignsRun: v.float64(),
    prospectsDiscovered: v.float64(),
    emailsGenerated: v.float64(),
    emailsSent: v.float64(),
    emailsDrafted: v.float64(),
    totalTokensUsed: v.float64(),
    totalCostCents: v.float64(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("userId", ["userId"])
    .index("userId_period", ["userId", "period"]),
};

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const jobsTables = {
  jobStatus: defineTable({
    campaignId: v.string(),
    userId: v.string(),
    currentStage: v.union(
      v.literal("initializing"),
      v.literal("discovering_prospects"),
      v.literal("researching"),
      v.literal("generating_emails"),
      v.literal("sending"),
      v.literal("completing"),
      v.literal("done"),
      v.literal("failed")
    ),
    progressPercent: v.float64(),
    currentProspect: v.optional(v.string()),
    updatedAt: v.float64(),
  })
    .index("campaignId", ["campaignId"])
    .index("userId", ["userId"]),

  campaignLogs: defineTable({
    campaignId: v.string(),
    userId: v.string(),
    level: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    stage: v.string(),
    message: v.string(),
    prospectName: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        prospectsFound: v.optional(v.float64()),
        currentIndex: v.optional(v.float64()),
        totalProspects: v.optional(v.float64()),
      })
    ),
    createdAt: v.float64(),
  })
    .index("campaignId", ["campaignId"])
    .index("campaignId_createdAt", ["campaignId", "createdAt"]),
};

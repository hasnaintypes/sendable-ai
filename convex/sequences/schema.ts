import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sequencesTables = {
  sequences: defineTable({
    campaignId: v.string(),
    campaignProspectId: v.string(),
    userId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("canceled")
    ),
    totalSteps: v.float64(),
    currentStep: v.float64(),
    repliedAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("campaignId", ["campaignId"])
    .index("campaignProspectId", ["campaignProspectId"])
    .index("userId_status", ["userId", "status"]),

  sequenceSteps: defineTable({
    sequenceId: v.string(),
    campaignProspectId: v.string(),
    userId: v.string(),
    stepNumber: v.float64(),
    delayDays: v.float64(),
    draftId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("scheduled"),
      v.literal("sent"),
      v.literal("skipped"),
      v.literal("failed")
    ),
    scheduledAt: v.optional(v.float64()),
    sentAt: v.optional(v.float64()),
    inngestJobId: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("sequenceId", ["sequenceId"])
    .index("campaignProspectId", ["campaignProspectId"])
    .index("status_scheduledAt", ["status", "scheduledAt"]),
};

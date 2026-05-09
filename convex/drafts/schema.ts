import { defineTable } from "convex/server";
import { v } from "convex/values";

export const draftsTables = {
  drafts: defineTable({
    userId: v.string(),
    campaignId: v.optional(v.string()),
    campaignProspectId: v.optional(v.string()),
    subject: v.string(),
    body: v.string(),
    bodyText: v.optional(v.string()),
    tone: v.optional(v.string()),
    intent: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    recipientCompany: v.optional(v.string()),
    status: v.union(
      v.literal("generating"),
      v.literal("ready"),
      v.literal("sent"),
      v.literal("saved_draft"),
      v.literal("archived")
    ),
    variantIndex: v.optional(v.float64()),
    variantGroupId: v.optional(v.string()),
    versionHistory: v.optional(
      v.array(
        v.object({
          subject: v.string(),
          body: v.string(),
          savedAt: v.float64(),
        })
      )
    ),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("userId", ["userId"])
    .index("campaignId", ["campaignId"])
    .index("campaignProspectId", ["campaignProspectId"])
    .index("userId_status", ["userId", "status"])
    .index("variantGroupId", ["variantGroupId"]),
};

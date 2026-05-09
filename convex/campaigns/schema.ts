import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaignsTables = {
  campaigns: defineTable({
    userId: v.string(),
    name: v.string(),
    goal: v.string(),
    productInfo: v.string(),
    campaignType: v.union(
      v.literal("cold_outreach"),
      v.literal("recruiting"),
      v.literal("networking"),
      v.literal("partnerships"),
      v.literal("investor_outreach"),
      v.literal("job_application"),
      v.literal("product_marketing")
    ),
    targetLocation: v.optional(v.string()),
    targetIndustry: v.optional(v.string()),
    targetBusinessType: v.optional(v.string()),
    targetRole: v.optional(v.string()),
    targetCompanySize: v.optional(v.string()),
    additionalCriteria: v.optional(v.string()),
    emailLimit: v.float64(),
    tone: v.union(
      v.literal("formal"),
      v.literal("friendly"),
      v.literal("persuasive"),
      v.literal("casual")
    ),
    permissionMode: v.union(v.literal("draft"), v.literal("send")),
    connectedInboxId: v.string(),
    scheduledSendWindow: v.optional(
      v.object({
        startHour: v.float64(),
        endHour: v.float64(),
        timezone: v.string(),
      })
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("queued"),
      v.literal("discovering"),
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("canceled")
    ),
    prospectsFound: v.float64(),
    prospectsResearched: v.float64(),
    emailsDrafted: v.float64(),
    emailsSent: v.float64(),
    emailsFailed: v.float64(),
    inngestJobId: v.optional(v.string()),
    startedAt: v.optional(v.float64()),
    completedAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("userId", ["userId"])
    .index("userId_status", ["userId", "status"])
    .index("userId_createdAt", ["userId", "createdAt"])
    .index("inngestJobId", ["inngestJobId"]),

  campaignProspects: defineTable({
    campaignId: v.string(),
    userId: v.string(),
    neonProspectId: v.string(),
    businessName: v.string(),
    contactEmail: v.optional(v.string()),
    contactName: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.union(
      v.literal("queued"),
      v.literal("researching"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("sent"),
      v.literal("drafted"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    draftId: v.optional(v.string()),
    sendResult: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    skippedReason: v.optional(v.string()),
    emailOpened: v.optional(v.boolean()),
    emailClicked: v.optional(v.boolean()),
    emailReplied: v.optional(v.boolean()),
    openedAt: v.optional(v.float64()),
    repliedAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("campaignId", ["campaignId"])
    .index("userId", ["userId"])
    .index("campaignId_status", ["campaignId", "status"])
    .index("neonProspectId", ["neonProspectId"]),
};

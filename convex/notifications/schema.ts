import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notificationsTables = {
  notifications: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("campaign_complete"),
      v.literal("campaign_failed"),
      v.literal("prospect_reply"),
      v.literal("inbox_expired"),
      v.literal("plan_limit_reached"),
      v.literal("plan_upgraded"),
      v.literal("security_alert"),
      v.literal("product_update"),
      v.literal("weekly_report")
    ),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    campaignId: v.optional(v.string()),
    createdAt: v.float64(),
  })
    .index("userId", ["userId"])
    .index("userId_read", ["userId", "read"])
    .index("userId_createdAt", ["userId", "createdAt"]),
};

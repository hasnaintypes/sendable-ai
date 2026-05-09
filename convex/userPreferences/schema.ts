import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userPreferencesTables = {
  userPreferences: defineTable({
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    defaultTone: v.optional(
      v.union(
        v.literal("formal"),
        v.literal("friendly"),
        v.literal("persuasive"),
        v.literal("casual")
      )
    ),
    defaultPermissionMode: v.optional(
      v.union(v.literal("draft"), v.literal("send"))
    ),
    defaultEmailLimit: v.optional(v.float64()),
    notifyCampaignUpdates: v.optional(v.boolean()),
    notifyEmailReplies: v.optional(v.boolean()),
    notifyLeadEngagement: v.optional(v.boolean()),
    notifyProductUpdates: v.optional(v.boolean()),
    notifySecurityAlerts: v.optional(v.boolean()),
    notifyWeeklyReports: v.optional(v.boolean()),
    notifyCampaignComplete: v.optional(v.boolean()),
    notifyProspectFailed: v.optional(v.boolean()),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("system"))
    ),
    sidebarCollapsed: v.optional(v.boolean()),
    createdAt: v.optional(v.float64()),
    updatedAt: v.optional(v.float64()),
  }).index("userId", ["userId"]),
};

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userPreferencesTables = {
  userPreferences: defineTable({
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    notifyEmailReplies: v.optional(v.boolean()),
    notifyCampaignUpdates: v.optional(v.boolean()),
    notifyLeadEngagement: v.optional(v.boolean()),
    notifyWeeklyReports: v.optional(v.boolean()),
    notifySecurityAlerts: v.optional(v.boolean()),
    notifyProductUpdates: v.optional(v.boolean()),
  }).index("userId", ["userId"]),
};

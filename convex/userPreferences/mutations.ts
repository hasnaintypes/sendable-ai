import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

export const upsert = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
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
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("system"))
    ),
    sidebarCollapsed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId: user._id,
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateNotifications = mutation({
  args: {
    notifyEmailReplies: v.optional(v.boolean()),
    notifyCampaignUpdates: v.optional(v.boolean()),
    notifyLeadEngagement: v.optional(v.boolean()),
    notifyWeeklyReports: v.optional(v.boolean()),
    notifySecurityAlerts: v.optional(v.boolean()),
    notifyProductUpdates: v.optional(v.boolean()),
    notifyCampaignComplete: v.optional(v.boolean()),
    notifyProspectFailed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId: user._id,
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

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
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId: user._id,
      ...args,
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
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId: user._id,
      ...args,
    });
  },
});

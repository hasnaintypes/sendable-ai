import { query } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("campaigns")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== user._id) return null;

    return campaign;
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user)
      return {
        total: 0,
        active: 0,
        emailsSent: 0,
        emailsDrafted: 0,
        emailsFailed: 0,
      };

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const active = campaigns.filter((c) =>
      ["queued", "discovering", "running"].includes(c.status)
    ).length;

    const emailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0);
    const emailsDrafted = campaigns.reduce((sum, c) => sum + c.emailsDrafted, 0);
    const emailsFailed = campaigns.reduce((sum, c) => sum + c.emailsFailed, 0);

    return {
      total: campaigns.length,
      active,
      emailsSent,
      emailsDrafted,
      emailsFailed,
    };
  },
});

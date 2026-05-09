import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();

    return await ctx.db.insert("campaigns", {
      userId: user._id,
      ...args,
      status: "draft",
      prospectsFound: 0,
      prospectsResearched: 0,
      emailsDrafted: 0,
      emailsSent: 0,
      emailsFailed: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    campaignId: v.id("campaigns"),
    status: v.union(
      v.literal("draft"),
      v.literal("queued"),
      v.literal("paused"),
      v.literal("canceled")
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== user._id)
      throw new Error("Not found");

    await ctx.db.patch(args.campaignId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

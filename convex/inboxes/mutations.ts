// sendable-web/convex/inboxes/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

export const setDefault = mutation({
  args: { id: v.id("connectedInboxes") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const inbox = await ctx.db.get(args.id);
    if (!inbox || inbox.userId !== user._id) throw new Error("Not found");

    const now = Date.now();
    const all = await ctx.db
      .query("connectedInboxes")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const item of all) {
      await ctx.db.patch(item._id, {
        isDefault: item._id === args.id,
        updatedAt: now,
      });
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("connectedInboxes"),
    displayName: v.optional(v.string()),
    permissionMode: v.optional(v.union(v.literal("draft"), v.literal("send"))),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const inbox = await ctx.db.get(args.id);
    if (!inbox || inbox.userId !== user._id) throw new Error("Not found");

    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...(fields.displayName !== undefined && { displayName: fields.displayName }),
      ...(fields.permissionMode !== undefined && { permissionMode: fields.permissionMode }),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("connectedInboxes") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const inbox = await ctx.db.get(args.id);
    if (!inbox || inbox.userId !== user._id) throw new Error("Not found");

    // Block removal if referenced by an active campaign
    const activeCampaign = await ctx.db
      .query("campaigns")
      .withIndex("userId_status", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("connectedInboxId"), args.id as string),
          q.or(
            q.eq(q.field("status"), "queued"),
            q.eq(q.field("status"), "discovering"),
            q.eq(q.field("status"), "running"),
          ),
        ),
      )
      .first();

    if (activeCampaign) {
      throw new Error(
        "Cannot remove an inbox used by an active campaign. Pause or cancel the campaign first.",
      );
    }

    const now = Date.now();
    await ctx.db.patch(args.id, { status: "revoked", isDefault: false, updatedAt: now });

    // If this was the default inbox, promote another active inbox
    if (inbox.isDefault) {
      const next = await ctx.db
        .query("connectedInboxes")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .filter((q) =>
          q.and(q.neq(q.field("_id"), args.id), q.neq(q.field("status"), "revoked")),
        )
        .first();
      if (next) await ctx.db.patch(next._id, { isDefault: true, updatedAt: now });
    }
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("connectedInboxes"),
    status: v.union(
      v.literal("active"),
      v.literal("expired"),
      v.literal("revoked"),
      v.literal("error"),
    ),
    lastError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const inbox = await ctx.db.get(args.id);
    if (!inbox || inbox.userId !== user._id) throw new Error("Not found");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: args.status,
      lastError: args.lastError,
      lastErrorAt: args.lastError ? now : undefined,
      updatedAt: now,
    });
  },
});

export const storeGmailInbox = mutation({
  args: {
    encryptedAccessToken: v.string(),
    encryptedRefreshToken: v.string(),
    accessTokenExpiresAt: v.float64(),
    email: v.string(),
    scopes: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();

    // Check if this Gmail address is already connected for this user
    const existing = await ctx.db
      .query("connectedInboxes")
      .withIndex("email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existing) {
      // Reconnect — refresh tokens and reactivate
      await ctx.db.patch(existing._id, {
        encryptedAccessToken: args.encryptedAccessToken,
        encryptedRefreshToken: args.encryptedRefreshToken,
        accessTokenExpiresAt: args.accessTokenExpiresAt,
        scopes: args.scopes,
        status: "active",
        lastError: undefined,
        lastErrorAt: undefined,
        updatedAt: now,
      });
      return existing._id;
    }

    // First inbox? Make it the default
    const existingInboxes = await ctx.db
      .query("connectedInboxes")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("status"), "revoked"))
      .collect();
    const isFirst = existingInboxes.length === 0;

    const inboxId = await ctx.db.insert("connectedInboxes", {
      userId: user._id,
      provider: "gmail",
      email: args.email,
      encryptedAccessToken: args.encryptedAccessToken,
      encryptedRefreshToken: args.encryptedRefreshToken,
      accessTokenExpiresAt: args.accessTokenExpiresAt,
      scopes: args.scopes,
      permissionMode: "draft",
      status: "active",
      isDefault: isFirst,
      createdAt: now,
      updatedAt: now,
    });

    return inboxId;
  },
});

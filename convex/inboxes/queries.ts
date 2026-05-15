// sendable-web/convex/inboxes/queries.ts
import { query } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

// Safe inbox shape — credentials never leave the server
function stripCredentials<
  T extends {
    encryptedAccessToken?: string;
    encryptedRefreshToken?: string;
    accessTokenExpiresAt?: number;
    scopes?: string;
  },
>(
  inbox: T,
): Omit<T, "encryptedAccessToken" | "encryptedRefreshToken" | "accessTokenExpiresAt" | "scopes"> {
  const {
    encryptedAccessToken: _a,
    encryptedRefreshToken: _r,
    accessTokenExpiresAt: _e,
    scopes: _s,
    ...safe
  } = inbox;
  return safe;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const inboxes = await ctx.db
      .query("connectedInboxes")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("status"), "revoked"))
      .order("desc")
      .collect();

    return inboxes.map(stripCredentials);
  },
});

export const get = query({
  args: { id: v.id("connectedInboxes") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const inbox = await ctx.db.get(args.id);
    if (!inbox || inbox.userId !== user._id) return null;
    if (inbox.status === "revoked") return null;

    return stripCredentials(inbox);
  },
});

export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const inbox = await ctx.db
      .query("connectedInboxes")
      .withIndex("userId_isDefault", (q) =>
        q.eq("userId", user._id).eq("isDefault", true),
      )
      .first();

    if (!inbox) return null;
    if (inbox.status === "revoked") return null;
    return stripCredentials(inbox);
  },
});

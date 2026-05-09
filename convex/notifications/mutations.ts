import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth/helpers";

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== user._id)
      throw new Error("Not found");

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("userId_read", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();

    await Promise.all(
      unread.map((n) => ctx.db.patch(n._id, { read: true }))
    );
  },
});

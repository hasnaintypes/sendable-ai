import { query } from "../_generated/server";
import { authComponent } from "../auth/helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("userId_read", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();

    return unread.length;
  },
});

import { query } from "../_generated/server";
import { authComponent } from "../auth/helpers";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    return preferences;
  },
});

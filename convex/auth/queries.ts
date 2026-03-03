import { components } from "../_generated/api";
import { query } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "./helpers";

export const { getAuthUser } = authComponent.clientApi();

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.users.getUser, {
      userId: args.userId,
    });
  },
});

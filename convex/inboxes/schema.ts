import { defineTable } from "convex/server";
import { v } from "convex/values";

export const inboxesTables = {
  connectedInboxes: defineTable({
    userId: v.string(),
    provider: v.union(v.literal("gmail"), v.literal("outlook")),
    email: v.string(),
    displayName: v.optional(v.string()),
    encryptedAccessToken: v.string(),
    encryptedRefreshToken: v.string(),
    accessTokenExpiresAt: v.float64(),
    scopes: v.string(),
    permissionMode: v.union(v.literal("draft"), v.literal("send")),
    status: v.union(
      v.literal("active"),
      v.literal("expired"),
      v.literal("revoked"),
      v.literal("error")
    ),
    lastUsedAt: v.optional(v.float64()),
    lastErrorAt: v.optional(v.float64()),
    lastError: v.optional(v.string()),
    isDefault: v.boolean(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("userId", ["userId"])
    .index("userId_provider", ["userId", "provider"])
    .index("userId_isDefault", ["userId", "isDefault"])
    .index("email", ["email"]),
};

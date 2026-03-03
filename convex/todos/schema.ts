import { defineTable } from "convex/server";
import { v } from "convex/values";

export const todosTables = {
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.string(),
  }).index("userId", ["userId"]),
};

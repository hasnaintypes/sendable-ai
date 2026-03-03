import { defineSchema } from "convex/server";
import { todosTables } from "./todos/schema";
import { usersTables } from "./users/schema";

export default defineSchema({
  ...todosTables,
  ...usersTables,
});

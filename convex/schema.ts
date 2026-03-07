import { defineSchema } from "convex/server";
import { todosTables } from "./todos/schema";
import { usersTables } from "./users/schema";
import { userPreferencesTables } from "./userPreferences/schema";

export default defineSchema({
  ...todosTables,
  ...usersTables,
  ...userPreferencesTables,
});

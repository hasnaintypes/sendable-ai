import { defineSchema } from "convex/server";
import { usersTables } from "./users/schema";
import { userPreferencesTables } from "./userPreferences/schema";

export default defineSchema({
  ...usersTables,
  ...userPreferencesTables,
});

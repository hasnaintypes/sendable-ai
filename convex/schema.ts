import { defineSchema } from "convex/server";
import { usersTables } from "./users/schema";

export default defineSchema({
  ...usersTables,
});

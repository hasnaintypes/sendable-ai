import { defineSchema } from "convex/server";
import { usersTables } from "./users/schema";
import { userPreferencesTables } from "./userPreferences/schema";
import { inboxesTables } from "./inboxes/schema";
import { campaignsTables } from "./campaigns/schema";
import { draftsTables } from "./drafts/schema";
import { jobsTables } from "./jobs/schema";
import { sequencesTables } from "./sequences/schema";
import { usageTables } from "./usage/schema";
import { notificationsTables } from "./notifications/schema";

export default defineSchema({
  ...usersTables,
  ...userPreferencesTables,
  ...inboxesTables,
  ...campaignsTables,
  ...draftsTables,
  ...jobsTables,
  ...sequencesTables,
  ...usageTables,
  ...notificationsTables,
});

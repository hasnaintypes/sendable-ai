import { internalAction } from "../_generated/server";
import { createAuth } from "./helpers";

export const rotateKeys = internalAction({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    return auth.api.rotateKeys();
  },
});

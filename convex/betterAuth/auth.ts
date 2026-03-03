import { createAuth } from "../auth/helpers";

// Export a static instance for Better Auth schema generation
export const auth = createAuth({} as any);

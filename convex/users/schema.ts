import { tables } from "../betterAuth/generatedSchema";

export const usersTables = {
  // Spread the generated schema and add a custom index
  user: tables.user.index("custom_index", ["foo"]),
  ...{
    account: tables.account,
    session: tables.session,
    verification: tables.verification,
    twoFactor: tables.twoFactor,
    jwks: tables.jwks,
  },
};

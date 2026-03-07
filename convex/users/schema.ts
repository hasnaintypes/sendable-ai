import { tables } from "../betterAuth/generatedSchema";

export const usersTables = {
  user: tables.user,
  account: tables.account,
  session: tables.session,
  verification: tables.verification,
  twoFactor: tables.twoFactor,
  jwks: tables.jwks,
};

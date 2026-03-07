/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_helpers from "../auth/helpers.js";
import type * as auth_mutations from "../auth/mutations.js";
import type * as auth_queries from "../auth/queries.js";
import type * as emails_components_BaseEmail from "../emails/components/BaseEmail.js";
import type * as emails_email from "../emails/email.js";
import type * as emails_templates_AlertEmail from "../emails/templates/AlertEmail.js";
import type * as emails_templates_BaseLayout from "../emails/templates/BaseLayout.js";
import type * as emails_templates_MagicLink from "../emails/templates/MagicLink.js";
import type * as emails_templates_ResetPassword from "../emails/templates/ResetPassword.js";
import type * as emails_templates_VerifyEmail from "../emails/templates/VerifyEmail.js";
import type * as emails_templates_VerifyOTP from "../emails/templates/VerifyOTP.js";
import type * as http from "../http.js";
import type * as lib_logger from "../lib/logger.js";
import type * as userPreferences_mutations from "../userPreferences/mutations.js";
import type * as userPreferences_queries from "../userPreferences/queries.js";
import type * as userPreferences_upload from "../userPreferences/upload.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "auth/helpers": typeof auth_helpers;
  "auth/mutations": typeof auth_mutations;
  "auth/queries": typeof auth_queries;
  "emails/components/BaseEmail": typeof emails_components_BaseEmail;
  "emails/email": typeof emails_email;
  "emails/templates/AlertEmail": typeof emails_templates_AlertEmail;
  "emails/templates/BaseLayout": typeof emails_templates_BaseLayout;
  "emails/templates/MagicLink": typeof emails_templates_MagicLink;
  "emails/templates/ResetPassword": typeof emails_templates_ResetPassword;
  "emails/templates/VerifyEmail": typeof emails_templates_VerifyEmail;
  "emails/templates/VerifyOTP": typeof emails_templates_VerifyOTP;
  http: typeof http;
  "lib/logger": typeof lib_logger;
  "userPreferences/mutations": typeof userPreferences_mutations;
  "userPreferences/queries": typeof userPreferences_queries;
  "userPreferences/upload": typeof userPreferences_upload;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};

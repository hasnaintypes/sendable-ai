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
import type * as emails_magicLink from "../emails/magicLink.js";
import type * as emails_resetPassword from "../emails/resetPassword.js";
import type * as emails_verifyEmail from "../emails/verifyEmail.js";
import type * as emails_verifyOTP from "../emails/verifyOTP.js";
import type * as http from "../http.js";
import type * as todos_mutations from "../todos/mutations.js";
import type * as todos_queries from "../todos/queries.js";
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
  "emails/magicLink": typeof emails_magicLink;
  "emails/resetPassword": typeof emails_resetPassword;
  "emails/verifyEmail": typeof emails_verifyEmail;
  "emails/verifyOTP": typeof emails_verifyOTP;
  http: typeof http;
  "todos/mutations": typeof todos_mutations;
  "todos/queries": typeof todos_queries;
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

import { components, api } from "../_generated/api";
import authSchema from "../betterAuth/schema";
import { createClient, GenericCtx } from "@convex-dev/better-auth";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";
import {
  anonymous,
  genericOAuth,
  twoFactor,
  username,
  magicLink,
  emailOTP,
} from "better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";

const siteUrl = process.env.SITE_URL;

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: true,
  },
);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const finalSiteUrl = (process.env.SITE_URL || process.env.BETTER_AUTH_URL || "https://localhost:3000") as string;
  if (!process.env.SITE_URL && !process.env.BETTER_AUTH_URL) {
    console.warn("WARNING: SITE_URL or BETTER_AUTH_URL is not set in Convex environment variables. This will cause INVALID_ORIGIN errors.");
  }
  return {
    baseURL: finalSiteUrl,
    trustedOrigins: [finalSiteUrl],
    database: authComponent.adapter(ctx),
    account: {
      accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        // Ensure the URL uses the correct protocol and path
        const verificationUrl = url.replace("http://localhost:3000", finalSiteUrl)
          .replace("/api/auth/verify-email", "/verify-email");

        await requireActionCtx(ctx).runAction(api.emails.email.sendEmailVerification, {
          to: user.email,
          url: verificationUrl,
        });
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        const resetPasswordUrl = url.replace("http://localhost:3000", finalSiteUrl);
        await requireActionCtx(ctx).runAction(api.emails.email.sendResetPassword, {
          to: user.email,
          url: resetPasswordUrl,
        });
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
    },
    user: {
      additionalFields: {
        foo: {
          type: "string",
          required: false,
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [
      anonymous(),
      username(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await requireActionCtx(ctx).runAction(api.emails.email.sendMagicLink, {
            to: email,
            url,
          });
        },
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await requireActionCtx(ctx).runAction(api.emails.email.sendOTPVerification, {
            to: email,
            code: otp,
          });
        },
      }),
      twoFactor(),
      genericOAuth({
        config: [
          {
            providerId: "slack",
            clientId: process.env.SLACK_CLIENT_ID as string,
            clientSecret: process.env.SLACK_CLIENT_SECRET as string,
            discoveryUrl: "https://slack.com/.well-known/openid-configuration",
            scopes: ["openid", "email", "profile"],
          },
        ],
      }),
      convex({
        authConfig,
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

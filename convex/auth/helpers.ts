import { components, api } from "../_generated/api";
import authSchema from "../betterAuth/schema";
import { createClient, GenericCtx } from "@convex-dev/better-auth";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";
import {
  anonymous,
  // genericOAuth, // TODO: Re-import when Slack OAuth is enabled
  twoFactor,
  username,
  magicLink,
  emailOTP,
} from "better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";

const siteUrl = process.env.SITE_URL;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please set it in your Convex dashboard or .env file.`
    );
  }
  return value;
}

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
    session: {
      // Session expires after 7 days of inactivity
      expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
      // Update session every time it's accessed (rolling session)
      updateAge: 60 * 60 * 24, // Update after 1 day of activity
    },
    account: {
      accountLinking: {
        enabled: true,
        allowDifferentEmails: false,
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
    // TODO: Uncomment social providers once OAuth env vars are configured
    // in your Convex dashboard (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET,
    // GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    // socialProviders: {
    //   github: {
    //     clientId: requireEnv("GITHUB_CLIENT_ID"),
    //     clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
    //   },
    //   google: {
    //     clientId: requireEnv("GOOGLE_CLIENT_ID"),
    //     clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    //     accessType: "offline",
    //     prompt: "select_account consent",
    //   },
    // },
    rateLimit: {
      window: 60, // 60 second window
      max: 10, // max 10 requests per window
    },
    user: {
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
      // TODO: Uncomment Slack OAuth once env vars are configured
      // (SLACK_CLIENT_ID, SLACK_CLIENT_SECRET)
      // genericOAuth({
      //   config: [
      //     {
      //       providerId: "slack",
      //       clientId: requireEnv("SLACK_CLIENT_ID"),
      //       clientSecret: requireEnv("SLACK_CLIENT_SECRET"),
      //       discoveryUrl: "https://slack.com/.well-known/openid-configuration",
      //       scopes: ["openid", "email", "profile"],
      //     },
      //   ],
      // }),
      convex({
        authConfig,
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

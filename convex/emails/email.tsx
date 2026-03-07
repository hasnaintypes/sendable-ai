"use node";

import "../polyfills";
import VerifyEmail from "./templates/VerifyEmail";
import MagicLinkEmail from "./templates/MagicLink";
import VerifyOTP from "./templates/VerifyOTP";
import ResetPasswordEmail from "./templates/ResetPassword";
import AlertEmail from "./templates/AlertEmail";
import { render } from "@react-email/components";
import React from "react";
import { components } from "../_generated/api";
import { Resend } from "@convex-dev/resend";
import { type ActionCtx } from "../_generated/server";
import nodemailer from "nodemailer";

import { action } from "../_generated/server";
import { v } from "convex/values";

export const resend = new Resend(components.resend, {
  testMode: false,
});

/**
 * Sends an email with Resend as primary and Nodemailer/SMTP as fallback.
 * Internal helper, not exported as an action.
 */
async function sendEmailWithFallback(
  ctx: ActionCtx,
  options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }
) {
  const { to, subject, html, from } = options;
  const fromName = process.env.SMTP_FROM_NAME || "Sendable AI";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "onboarding@resend.dev";
  const finalFrom = from || `${fromName} <${fromEmail}>`;

  const emailProvider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();
  const verifiedRecipient = process.env.RESEND_VERIFIED_RECIPIENT;

  console.log(`[EmailService] Preparing to send to: ${to}`);
  console.log(`[EmailService] Provider: ${emailProvider}`);

  // If prioritizing SMTP
  if (emailProvider === "smtp") {
    console.log(`[EmailService] Prioritizing SMTP delivery to ${to}`);
    try {
      return await sendViaSmtp(finalFrom, to, subject, html);
    } catch (smtpError) {
      console.error("[EmailService] SMTP delivery failed:", smtpError);
      console.log("[EmailService] Attempting Resend fallback...");
    }
  }

  const canUseResend = !verifiedRecipient || to.toLowerCase() === verifiedRecipient.toLowerCase();
  console.log(`[EmailService] Can use Resend for ${to}: ${canUseResend}`);

  if (canUseResend) {
    try {
      console.log(`[EmailService] Attempting Resend to ${to}...`);
      await resend.sendEmail(ctx, {
        from: finalFrom,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] Success via Resend to ${to}`);
      return;
    } catch (resendError) {
      console.error("[EmailService] Resend delivery failed:", resendError);
      console.log("[EmailService] Attempting SMTP fallback...");
    }
  }

  // Final fallback: SMTP
  console.log(`[EmailService] Final attempt via SMTP to ${to}`);
  return await sendViaSmtp(finalFrom, to, subject, html);
}

/**
 * Helper to send email via SMTP
 */
async function sendViaSmtp(from: string, to: string, subject: string, html: string) {
  console.log(`[SMTP] Connecting to ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}...`);
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  console.log(`[SMTP] Success! messageId: ${info.messageId}`);
  return info;
}


/**
 * Generic email sending action.
 * Can be called from other Convex functions.
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await sendEmailWithFallback(ctx, args);
  },
});

export const sendAlertEmail = action({
  args: {
    to: v.string(),
    title: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { to, title, message }) => {
    await sendEmailWithFallback(ctx, {
      to,
      subject: title,
      html: await render(<AlertEmail title={title} message={message} />),
    });
  },
});

export const sendEmailVerification = action({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { to, url }) => {
    console.log(`[Action] sendEmailVerification called for ${to}`);
    try {
      const html = await render(<VerifyEmail url={url} />);
      console.log("[Action] Template rendered successfully");
      await sendEmailWithFallback(ctx, {
        to,
        subject: "Verify your email address",
        html,
      });
    } catch (error) {
      console.error("[Action] sendEmailVerification failed:", error);
      throw error;
    }
  },
});

export const sendOTPVerification = action({
  args: {
    to: v.string(),
    code: v.string(),
  },
  handler: async (ctx, { to, code }) => {
    await sendEmailWithFallback(ctx, {
      to,
      subject: "Verify your email address",
      html: await render(<VerifyOTP code={code} />),
    });
  },
});

export const sendMagicLink = action({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { to, url }) => {
    await sendEmailWithFallback(ctx, {
      to,
      subject: "Sign in to your account",
      html: await render(<MagicLinkEmail url={url} />),
    });
  },
});

export const sendResetPassword = action({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { to, url }) => {
    await sendEmailWithFallback(ctx, {
      to,
      subject: "Reset your password",
      html: await render(<ResetPasswordEmail url={url} />),
    });
  },
});

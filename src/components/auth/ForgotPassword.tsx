"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import Link from "next/link";

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitted(true);
      toast.success("Check your email for the password reset link!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send reset password link. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-muted-foreground text-sm text-balance">
              Click the link in the email to reset your password. The link will
              expire in 24 hours.
            </p>
          </div>
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full"
            >
              Try another email
            </Button>
          </Field>
          <Field>
            <Link href="/sign-in" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleForgotPassword}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <FieldDescription>
            We&apos;ll send a password reset link to this email address.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </Field>
        <Field>
          <Link href="/sign-in" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Button>
          </Link>
        </Field>
      </FieldGroup>
    </form>
  );
}

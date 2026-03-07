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
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          setLoading(false);
          toast.success("Successfully signed in!");
          if (ctx.data.twoFactorRedirect) {
            router.push("/verify-2fa");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (ctx) => {
          setLoading(false);
          const message = ctx?.error?.message || "Failed to sign in. Please check your credentials.";
          toast.error(message);
        },
      },
    );
  };

  // TODO: Enable social sign-in once OAuth providers are configured
  // const handleSocialSignIn = async (provider: "github" | "google" | "slack") => {
  //   await authClient.signIn.social({ provider, callbackURL: "/dashboard" }, { ... });
  // };

  const handleForgotPasswordClick = () => {
    router.push("/forget-password");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSignIn}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your credentials below to login
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
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              disabled={loading}
              className="ml-auto text-sm underline-offset-4 hover:underline disabled:opacity-50"
            >
              Forgot your password?
            </button>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Field>
        {/* TODO: Uncomment social sign-in once OAuth providers are configured */}
        {/* <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled={loading} onClick={() => handleSocialSignIn("github")}>
            Login with GitHub
          </Button>
        </Field> */}
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="text-primary hover:underline underline-offset-4"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

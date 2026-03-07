"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        await authClient.verifyEmail(
          {
            query: {
              token,
            },
          },
          {
            onSuccess: () => {
              setStatus("success");
              toast.success("Email verified successfully!");
            },
            onError: (ctx) => {
              setStatus("error");
              setMessage(ctx.error.message || "Failed to verify email.");
              toast.error(ctx.error.message || "Failed to verify email.");
            },
          },
        );
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Email Verified!</h1>
              <p className="text-muted-foreground">
                Your email has been successfully verified. You can now sign in
                to your account.
              </p>
            </div>
            <Button asChild className="w-full h-11 text-base font-medium">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-muted-foreground">{message}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full h-11">
                <Link href="/sign-up">Back to Sign Up</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                The link may have expired or already been used.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

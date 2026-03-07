"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "password" | "email" | "sent";

export function ChangeEmailDialog({ open, onOpenChange }: ChangeEmailDialogProps) {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("password");
    setPassword("");
    setNewEmail("");
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleVerifyPassword = async () => {
    if (!password.trim()) return;
    setStep("email");
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    try {
      await authClient.changeEmail({
        newEmail,
        callbackURL: `${window.location.origin}/settings`,
      });
      setStep("sent");
    } catch {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "password" && (
          <>
            <DialogHeader>
              <DialogTitle>Change Email Address</DialogTitle>
              <DialogDescription>
                Confirm your current password to proceed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleVerifyPassword} disabled={!password.trim()}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "email" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter New Email</DialogTitle>
              <DialogDescription>
                We&apos;ll send a verification link to your new email address.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="you@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChangeEmail()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("password")}>
                Back
              </Button>
              <Button onClick={handleChangeEmail} disabled={loading || !newEmail.trim()}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Verification
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "sent" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Verification Sent</DialogTitle>
                  <DialogDescription>
                    Check your inbox at <strong>{newEmail}</strong> and click the verification link.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="rounded-lg border bg-muted/50 p-4 my-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your email will be updated once you verify the new address.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

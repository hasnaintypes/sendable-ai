"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

interface TwoFactorSetupDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TwoFactorSetupDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TwoFactorSetupDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"password" | "setup">("password");
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await authClient.twoFactor.enable({
        password,
      });

      if (data?.totpURI) {
        setTotpUri(data.totpURI);
        // Extract secret from URI (format: otpauth://totp/...?secret=XXX&...)
        const secretMatch = data.totpURI.match(/secret=([^&]+)/);
        if (secretMatch) {
          setSecret(secretMatch[1]);
        }
        setStep("setup");
      }
    } catch {
      toast.error("Failed to enable 2FA. Please check your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    try {
      setLoading(true);
      await authClient.twoFactor.verifyTotp({
        code,
      });
      toast.success("2FA enabled successfully!");
      handleClose();
    } catch {
      toast.error("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep("password");
      setPassword("");
      setTotpUri(undefined);
      setSecret(undefined);
      setCode("");
      setCopied(false);
    }, 200);
  };

  const copySecret = async () => {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-120">
        {step === "password" ? (
          <>
            <DialogHeader>
              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Enter your password to verify your identity and continue with
                2FA setup.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Setup Authenticator App</DialogTitle>
              <DialogDescription>
                Each time you log in, in addition to your password, you&apos;ll use an
                authenticator app to generate a one-time code.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Step 1: Scan QR Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    1
                  </div>
                  <p className="text-sm font-semibold">Scan QR code</p>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Scan the QR code below or manually enter the secret key into your
                  authenticator app.
                </p>

                {totpUri && (
                  <div className="flex flex-col items-center gap-2 pl-7">
                    <div className="flex justify-center p-3 bg-white dark:bg-neutral-950 rounded-lg border">
                      <QRCode value={totpUri} size={140} />
                    </div>

                    <div className="w-full space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Can&apos;t scan QR code?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enter this secret instead:
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-muted px-3 py-1.5">
                          <code className="text-xs font-mono font-semibold">
                            {secret}
                          </code>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={copySecret}
                          className="shrink-0 h-8"
                        >
                          {copied ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Get Verification Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    2
                  </div>
                  <p className="text-sm font-semibold">Get verification code</p>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Enter the 6-digit code you see in your authenticator app.
                </p>

                <div className="pl-7 space-y-1.5">
                  <Label htmlFor="verification-code" className="text-sm">
                    Enter verification code
                  </Label>
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleVerifyCode} disabled={loading || code.length !== 6}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

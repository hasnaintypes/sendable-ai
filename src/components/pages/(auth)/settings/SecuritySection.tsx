"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountDialog } from "@/components/dialogs/DeleteAccountDialog";
import { TwoFactorSetupDialog } from "@/components/dialogs/TwoFactorSetupDialog";
import { ChangeEmailDialog } from "@/components/dialogs/ChangeEmailDialog";
import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, Key, Smartphone, Mail, Monitor } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";

interface Session {
  id: string;
  token: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

function parseBrowserName(ua: string | null): string {
  if (!ua) return "unknown";
  if (ua.includes("Edg")) return "edge";
  if (ua.includes("Chrome")) return "chrome";
  if (ua.includes("Firefox")) return "firefox";
  if (ua.includes("Safari")) return "safari";
  return "unknown";
}

function parseUserAgent(ua: string | null): string {
  if (!ua) return "Unknown Device";

  let browser = "Unknown Browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return `${browser} on ${os}`;
}

const browserIcons: Record<string, string> = {
  chrome: "/icons/chrome.svg",
  firefox: "/icons/firefox.svg",
  edge: "/icons/edge.svg",
};

function BrowserIcon({ userAgent }: { userAgent: string | null }) {
  const browser = parseBrowserName(userAgent);
  const iconPath = browserIcons[browser];

  if (iconPath) {
    return (
      <Image
        src={iconPath}
        alt={browser}
        width={20}
        height={20}
        className="h-5 w-5"
      />
    );
  }

  return <Monitor className="h-5 w-5 text-primary" />;
}

function isSessionExpired(session: Session): boolean {
  return new Date(session.expiresAt).getTime() < Date.now();
}

export function SecuritySection() {
  const user = useQuery(api.auth.queries.getCurrentUser);
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await authClient.listSessions();
      if (response.data) {
        setSessions(response.data as Session[]);
      }
    } catch {
      // Sessions listing may not be available
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    // Get the current session token
    authClient.getSession().then((res) => {
      if (res.data?.session) {
        setCurrentSessionToken(res.data.session.token);
      }
    });
  }, [fetchSessions]);

  const [disable2FAPassword, setDisable2FAPassword] = useState("");
  const [show2FAPrompt, setShow2FAPrompt] = useState(false);

  const handleDisable2FA = async () => {
    if (!show2FAPrompt) {
      setShow2FAPrompt(true);
      return;
    }
    if (!disable2FAPassword.trim()) {
      toast.error("Please enter your password to disable 2FA");
      return;
    }
    setLoading("2fa");
    try {
      await authClient.twoFactor.disable({
        password: disable2FAPassword,
      });
      toast.success("2FA disabled successfully");
      setShow2FAPrompt(false);
      setDisable2FAPassword("");
    } catch {
      toast.error("Failed to disable 2FA. Check your password.");
    } finally {
      setLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    try {
      setLoading("password");

      await authClient.requestPasswordReset({
        email: user.email,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });

      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    } finally {
      setLoading(null);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      setLoading(`session-${sessionToken}`);
      await authClient.revokeSession({ token: sessionToken });
      toast.success("Session revoked");
      fetchSessions();
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setLoading(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      setLoading("revoke-all");
      await authClient.revokeOtherSessions();
      toast.success("All other sessions revoked");
      fetchSessions();
    } catch {
      toast.error("Failed to revoke sessions");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser();
      toast.success("Account deleted");
      router.push("/");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const [showAllSessions, setShowAllSessions] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);
  const VISIBLE_SESSION_COUNT = 3;
  const visibleOtherSessions = showAllSessions
    ? otherSessions
    : otherSessions.slice(0, VISIBLE_SESSION_COUNT);
  const hasMoreSessions = otherSessions.length > VISIBLE_SESSION_COUNT;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage how your account is protected.
        </p>
      </div>

      <div className="rounded-lg border bg-background">

        {/* 2FA */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Two-Factor Authentication</p>
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Add an extra verification step when signing in.
              </p>
            </div>

          </div>

          <div className="flex gap-2">
            <TwoFactorSetupDialog
              open={twoFactorDialogOpen}
              onOpenChange={setTwoFactorDialogOpen}
              trigger={
                <Button size="sm">
                  Enable
                </Button>
              }
            />

            <Button
              size="sm"
              variant="outline"
              onClick={handleDisable2FA}
              disabled={loading === "2fa"}
            >
              {loading === "2fa" && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Disable
            </Button>
          </div>
        </div>

        {show2FAPrompt && (
          <div className="px-5 pb-4 flex items-center gap-2">
            <Input
              type="password"
              placeholder="Enter password to confirm"
              value={disable2FAPassword}
              onChange={(e) => setDisable2FAPassword(e.target.value)}
              className="max-w-xs"
              onKeyDown={(e) => e.key === "Enter" && handleDisable2FA()}
            />
            <Button size="sm" onClick={handleDisable2FA} disabled={loading === "2fa"}>
              {loading === "2fa" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShow2FAPrompt(false); setDisable2FAPassword(""); }}>
              Cancel
            </Button>
          </div>
        )}

        <Separator />

        {/* Password */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Key className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Reset your password via email.
              </p>
            </div>

          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPassword}
            disabled={loading === "password"}
          >
            {loading === "password" && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Change Password
          </Button>
        </div>

        <Separator />

        {/* Email */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Mail className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">
                Update your email address for account access.
              </p>
            </div>

          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setChangeEmailOpen(true)}
          >
            Change Email
          </Button>
        </div>

      </div>

      <ChangeEmailDialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen} />

      {/* Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Places where you&apos;re logged into Sendable
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevokeOtherSessions}
            disabled={loading === "revoke-all" || otherSessions.length === 0}
          >
            {loading === "revoke-all" && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Sign out all other sessions
          </Button>
        </div>

        <div className="rounded-lg border bg-background">
          {/* Current Session */}
          {currentSession && (
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <BrowserIcon userAgent={currentSession.userAgent} />
                </div>

                <div>
                  <p className="font-medium">{parseUserAgent(currentSession.userAgent)}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      Current session
                    </Badge>
                    {currentSession.ipAddress && (
                      <>
                        <span>&#183;</span>
                        <span>{currentSession.ipAddress}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {otherSessions.length > 0 && (
            <>
              <Separator />
              <div className="p-5 space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {otherSessions.length} other {otherSessions.length === 1 ? "session" : "sessions"}
                </p>

                {visibleOtherSessions.map((session, index) => {
                  const expired = isSessionExpired(session);
                  return (
                    <div key={session.token}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <BrowserIcon userAgent={session.userAgent} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{parseUserAgent(session.userAgent)}</p>
                              {expired && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Last active {new Date(session.updatedAt).toLocaleDateString()}</span>
                              {session.ipAddress && (
                                <>
                                  <span>&#183;</span>
                                  <span>{session.ipAddress}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {!expired && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeSession(session.token)}
                            disabled={loading === `session-${session.token}`}
                          >
                            {loading === `session-${session.token}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Sign out"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {hasMoreSessions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllSessions(!showAllSessions)}
                  >
                    {showAllSessions
                      ? "Show less"
                      : `Show ${otherSessions.length - VISIBLE_SESSION_COUNT} more`}
                  </Button>
                )}
              </div>
            </>
          )}

          {sessions.length === 0 && (
            <div className="p-5 text-center text-sm text-muted-foreground">
              Loading sessions...
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/30">

        <div className="p-5 flex items-start justify-between">

          <div className="flex gap-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>

            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all data.
              </p>
            </div>

          </div>

          <DeleteAccountDialog onConfirm={handleDeleteAccount} />

        </div>

      </div>
    </div>
  );
}

// sendable-web/src/components/pages/(auth)/settings/IntegrationSection.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Plus, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ConnectGmailDialog } from "./ConnectGmailDialog";
import { EditInboxSheet } from "./EditInboxSheet";

type SafeInbox = {
  _id: Id<"connectedInboxes">;
  email: string;
  displayName?: string;
  provider: "gmail" | "outlook";
  permissionMode: "draft" | "send";
  status: "active" | "expired" | "revoked" | "error";
  isDefault: boolean;
  createdAt: number;
};

function GmailStatusBadge({ status }: { status: SafeInbox["status"] }) {
  if (status === "active")
    return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15">Active</Badge>;
  if (status === "expired" || status === "error")
    return <Badge variant="destructive">Error</Badge>;
  return <Badge variant="secondary">Inactive</Badge>;
}

function PermissionBadge({ mode }: { mode: SafeInbox["permissionMode"] }) {
  if (mode === "send")
    return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15">Sends automatically</Badge>;
  return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15">Drafts only</Badge>;
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.148C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  );
}

// Free plan: 1 inbox, Pro: 3, Growth: unlimited
// TODO: derive from user.plan once billing is wired
const MAX_GMAIL_INBOXES = 3;

export function IntegrationSection() {
  const inboxes = useQuery(api.inboxes.queries.list);
  const connectedGmail = inboxes?.filter((i) => i.provider === "gmail") ?? [];

  const [connectOpen, setConnectOpen] = useState(false);
  const [editInbox, setEditInbox] = useState<SafeInbox | null>(null);

  // Handle OAuth redirect query params
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    const tab = searchParams.get("tab");

    if (tab !== "integrations") return;

    if (connected === "true") {
      toast.success("Gmail connected successfully");
      router.replace("/settings?tab=integrations");
    } else if (error === "connect_failed") {
      toast.error("Could not connect Gmail. Please try again.");
      router.replace("/settings?tab=integrations");
    } else if (error === "invalid_state") {
      toast.error("Security check failed. Please try again.");
      router.replace("/settings?tab=integrations");
    } else if (error === "oauth_denied") {
      toast.error("Gmail connection cancelled.");
      router.replace("/settings?tab=integrations");
    } else if (error === "no_refresh_token") {
      toast.error("Gmail did not return a refresh token. Please try connecting again.");
      router.replace("/settings?tab=integrations");
    }
  }, [searchParams, router]);

  const atLimit = connectedGmail.length >= MAX_GMAIL_INBOXES;

  // Non-Gmail integrations keep their current placeholder behaviour (disabled buttons, no state needed)
  const otherIntegrations = [
    {
      id: "outlook" as const,
      name: "Outlook",
      provider: "Microsoft",
      description:
        "Seamlessly integrate with Microsoft Outlook or Office 365 to send emails, sync contacts, and automate your email campaigns.",
      features: ["Send emails", "Calendar sync", "Contact import"],
      iconPath: "/icons/ms-outlook.svg",
      docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview",
      comingSoon: true,
    },
    {
      id: "googleCalendar" as const,
      name: "Google Calendar",
      provider: "Google",
      description:
        "Automatically schedule follow-up meetings, sync events with your leads, and manage your sales pipeline.",
      features: ["Schedule meetings", "Auto follow-ups", "Event sync"],
      iconPath: "/icons/google-calendar.svg",
      docsUrl: "https://developers.google.com/calendar/api",
      comingSoon: false,
    },
    {
      id: "slack" as const,
      name: "Slack",
      provider: "Slack",
      description:
        "Get instant notifications in your Slack workspace when leads respond or campaigns complete.",
      features: ["Lead alerts", "Campaign updates", "Team notifications"],
      iconPath: "/icons/slack.svg",
      docsUrl: "https://api.slack.com/messaging/webhooks",
      comingSoon: false,
    },
    {
      id: "discord" as const,
      name: "Discord",
      provider: "Discord",
      description:
        "Receive real-time alerts in your Discord server when leads engage with your campaigns.",
      features: ["Server webhooks", "Real-time alerts", "Team collaboration"],
      iconPath: "/icons/discord.svg",
      docsUrl: "https://discord.com/developers/docs/resources/webhook",
      comingSoon: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools to streamline your outreach workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gmail card — real connection state */}
        <Card className="transition-all hover:shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-background">
                <GmailIcon className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base">Gmail</h3>
                  {connectedGmail.length > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                </div>
                <a
                  href="https://developers.google.com/gmail/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  View documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your Gmail account to send personalized cold emails, track opens and replies, and manage your outreach campaigns with full Gmail API integration.
            </p>

            {connectedGmail.length === 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setConnectOpen(true)}
              >
                Connect Gmail
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                {connectedGmail.map((inbox) => (
                  <div
                    key={inbox._id}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-2"
                  >
                    <GmailIcon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground truncate">
                        {inbox.displayName || inbox.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <GmailStatusBadge status={inbox.status} />
                        <PermissionBadge mode={inbox.permissionMode} />
                        {inbox.isDefault && (
                          <Badge variant="outline" className="text-[10px]">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditInbox(inbox)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-muted-foreground text-[12px]"
                  disabled={atLimit}
                  title={atLimit ? "Upgrade to connect more inboxes" : undefined}
                  onClick={() => setConnectOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Connect another Gmail
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other integrations — unchanged placeholder behaviour */}
        {otherIntegrations.map((integration) => (
          <Card key={integration.id} className={integration.comingSoon ? "opacity-60" : "transition-all hover:shadow-sm"}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-background">
                  <Image
                    src={integration.iconPath}
                    alt={integration.name}
                    width={28}
                    height={28}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{integration.name}</h3>
                    {integration.comingSoon && (
                      <span className="text-[9px] font-medium uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <a
                    href={integration.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    View documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {integration.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm"
                disabled={integration.comingSoon}
                title={integration.comingSoon ? `${integration.name} integration coming soon` : undefined}
              >
                {integration.comingSoon ? "Coming soon" : "View integration"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm">
          Request Integration
        </Button>
      </div>

      <ConnectGmailDialog open={connectOpen} onOpenChange={setConnectOpen} />
      <EditInboxSheet inbox={editInbox} onOpenChange={(open) => { if (!open) setEditInbox(null); }} />
    </div>
  );
}

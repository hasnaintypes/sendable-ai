"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type IntegrationKey =
  | "gmail"
  | "outlook"
  | "googleCalendar"
  | "slack"
  | "discover"
  | "discord";

export function IntegrationSection() {
  const [integrations, setIntegrations] = useState<
    Record<IntegrationKey, boolean>
  >({
    gmail: false,
    outlook: false,
    googleCalendar: false,
    slack: false,
    discover: false,
    discord: false,
  });

  const [loading, setLoading] = useState<IntegrationKey | null>(null);

  const handleConnect = async (integration: IntegrationKey) => {
    const connected = integrations[integration];
    setLoading(integration);

    // TODO: Replace with OAuth flow
    setTimeout(() => {
      setIntegrations((prev) => ({
        ...prev,
        [integration]: !prev[integration],
      }));

      toast.success(
        connected
          ? `Disconnected from ${integration}`
          : `Connected to ${integration}`,
      );

      setLoading(null);
    }, 1200);
  };

  const integrationsList = [
    {
      id: "gmail" as const,
      name: "Gmail",
      provider: "Google",
      description:
        "Connect your Gmail account to send personalized cold emails, track opens and replies, and manage all your outreach campaigns directly from your inbox with full Gmail API integration.",
      features: ["Send emails", "Track replies", "Sync inbox"],
      iconPath: "/icons/google-gmail.svg",
      docsUrl: "https://developers.google.com/gmail/api",
    },
    {
      id: "outlook" as const,
      name: "Outlook",
      provider: "Microsoft",
      description:
        "Seamlessly integrate with Microsoft Outlook or Office 365 to send emails, sync contacts, schedule meetings, and automate your email campaigns with Microsoft Graph API.",
      features: ["Send emails", "Calendar sync", "Contact import"],
      iconPath: "/icons/ms-outlook.svg",
      docsUrl:
        "https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview",
    },
    {
      id: "googleCalendar" as const,
      name: "Google Calendar",
      provider: "Google",
      description:
        "Automatically schedule follow-up meetings, sync events with your leads, set reminders for outreach activities, and manage your sales pipeline with intelligent calendar integration.",
      features: ["Schedule meetings", "Auto follow-ups", "Event sync"],
      iconPath: "/icons/google-calendar.svg",
      docsUrl: "https://developers.google.com/calendar/api",
    },
    {
      id: "slack" as const,
      name: "Slack",
      provider: "Slack",
      description:
        "Get instant notifications in your Slack workspace when leads respond, campaigns complete, or important events occur. Keep your team informed and collaborate on outreach strategies in real-time.",
      features: ["Lead alerts", "Campaign updates", "Team notifications"],
      iconPath: "/icons/slack.svg",
      docsUrl: "https://api.slack.com/messaging/webhooks",
    },
    {
      id: "discord" as const,
      name: "Discord",
      provider: "Discord",
      description:
        "Receive real-time notifications and alerts in your Discord server when leads engage with your campaigns. Share updates with your team and collaborate on outreach strategies through Discord webhooks.",
      features: ["Server webhooks", "Real-time alerts", "Team collaboration"],
      iconPath: "/icons/discord.svg",
      docsUrl: "https://discord.com/developers/docs/resources/webhook",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools to streamline your outreach workflow
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationsList.map((integration) => {
          const connected = integrations[integration.id];
          const isLoading = loading === integration.id;

          return (
            <Card
              key={integration.id}
              className="transition-all hover:shadow-sm"
            >
              <CardContent className="p-5 space-y-4">
                {/* Icon and Name */}
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
                    <h3 className="font-semibold text-base mb-1">
                      {integration.name}
                    </h3>
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

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                  {integration.description}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => handleConnect(integration.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "View integration"
                    )}
                  </Button>

                  <Switch
                    checked={connected}
                    onCheckedChange={() => handleConnect(integration.id)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm">
          Request Integration
        </Button>
      </div>
    </div>
  );
}

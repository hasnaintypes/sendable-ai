"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Bell,
  Loader2,
  Mail,
  TrendingUp,
  Calendar,
  Shield,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const defaults = {
  emailReplies: true,
  campaignUpdates: true,
  leadEngagement: true,
  weeklyReports: false,
  securityAlerts: true,
  productUpdates: false,
};

export function NotificationSection() {
  const preferences = useQuery(api.userPreferences.queries.get);
  const updateNotifications = useMutation(
    api.userPreferences.mutations.updateNotifications,
  );
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(defaults);

  useEffect(() => {
    if (preferences) {
      setNotifications({
        emailReplies: preferences.notifyEmailReplies ?? defaults.emailReplies,
        campaignUpdates:
          preferences.notifyCampaignUpdates ?? defaults.campaignUpdates,
        leadEngagement:
          preferences.notifyLeadEngagement ?? defaults.leadEngagement,
        weeklyReports:
          preferences.notifyWeeklyReports ?? defaults.weeklyReports,
        securityAlerts:
          preferences.notifySecurityAlerts ?? defaults.securityAlerts,
        productUpdates:
          preferences.notifyProductUpdates ?? defaults.productUpdates,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateNotifications({
        notifyEmailReplies: notifications.emailReplies,
        notifyCampaignUpdates: notifications.campaignUpdates,
        notifyLeadEngagement: notifications.leadEngagement,
        notifyWeeklyReports: notifications.weeklyReports,
        notifySecurityAlerts: notifications.securityAlerts,
        notifyProductUpdates: notifications.productUpdates,
      });
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Failed to save notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNotifications(defaults);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationGroups = [
    {
      id: "emailReplies",
      icon: Mail,
      label: "Email Replies",
      description: "Get notified when leads reply to your outreach campaigns",
      enabled: notifications.emailReplies,
      recommended: true,
    },
    {
      id: "campaignUpdates",
      icon: TrendingUp,
      label: "Campaign Updates",
      description:
        "Receive updates on campaign performance metrics and status changes",
      enabled: notifications.campaignUpdates,
    },
    {
      id: "leadEngagement",
      icon: Megaphone,
      label: "Lead Engagement",
      description: "Get alerts when leads show high engagement or open emails",
      enabled: notifications.leadEngagement,
      recommended: true,
    },
    {
      id: "weeklyReports",
      icon: Calendar,
      label: "Weekly Reports",
      description: "Receive comprehensive weekly performance summaries",
      enabled: notifications.weeklyReports,
    },
    {
      id: "securityAlerts",
      icon: Shield,
      label: "Security Alerts",
      description: "Critical security notifications and account activity",
      enabled: notifications.securityAlerts,
      recommended: true,
    },
    {
      id: "productUpdates",
      icon: Bell,
      label: "Product Updates",
      description: "Latest features, improvements, and product announcements",
      enabled: notifications.productUpdates,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Configure how and when you receive notifications from Sendable
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose which notifications you&apos;d like to receive
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-0">
          {notificationGroups.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start justify-between gap-4 py-4 ${index !== notificationGroups.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">
                        {notification.label}
                      </Label>
                      {notification.recommended && (
                        <Badge variant="secondary" className="text-xs py-0 h-5">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notification.enabled}
                  onCheckedChange={() =>
                    toggleNotification(
                      notification.id as keyof typeof notifications,
                    )
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}

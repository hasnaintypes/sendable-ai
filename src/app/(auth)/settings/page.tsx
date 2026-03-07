"use client";

import { ProfileSection } from "@/components/pages/(auth)/settings/ProfileSection";
import { NotificationSection } from "@/components/pages/(auth)/settings/NotificationSection";
import { IntegrationSection } from "@/components/pages/(auth)/settings/IntegrationSection";
import { SecuritySection } from "@/components/pages/(auth)/settings/SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Bell, Plug, Shield } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "integrations", label: "Integrations", icon: Plug },
  { value: "security", label: "Security", icon: Shield },
];

function SettingsSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="rounded-lg border p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-56" />
        <div className="flex items-center gap-6 pt-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      <div className="rounded-lg border p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex-1 w-full px-6 py-4">
        <Tabs defaultValue="profile" orientation="vertical" className="flex gap-8">
          <TabsList className="flex flex-col h-fit w-52 shrink-0 bg-transparent gap-1 p-0 items-stretch sticky top-6 self-start">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="justify-start gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="profile" className="mt-0 outline-none">
              <ProfileSectionWithSkeleton />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 outline-none">
              <NotificationSectionWithSkeleton />
            </TabsContent>

            <TabsContent value="integrations" className="mt-0 outline-none">
              <IntegrationSection />
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <SecuritySectionWithSkeleton />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileSectionWithSkeleton() {
  const user = useQuery(api.auth.queries.getCurrentUser);
  const preferences = useQuery(api.userPreferences.queries.get);

  if (user === undefined || preferences === undefined) {
    return <SettingsSkeleton />;
  }

  return <ProfileSection />;
}

function NotificationSectionWithSkeleton() {
  const preferences = useQuery(api.userPreferences.queries.get);

  if (preferences === undefined) {
    return <SettingsSkeleton />;
  }

  return <NotificationSection />;
}

function SecuritySectionWithSkeleton() {
  const user = useQuery(api.auth.queries.getCurrentUser);

  if (user === undefined) {
    return <SettingsSkeleton />;
  }

  return <SecuritySection />;
}

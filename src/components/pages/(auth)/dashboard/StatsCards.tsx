"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Send, MailCheck, Activity } from "lucide-react";

interface Props {
  stats:
    | {
        total: number;
        active: number;
        emailsSent: number;
        emailsDrafted: number;
        emailsFailed: number;
      }
    | undefined;
}

const cards = [
  {
    label: "Total Campaigns",
    key: "total" as const,
    icon: Mail,
    description: "All time",
  },
  {
    label: "Active",
    key: "active" as const,
    icon: Activity,
    description: "Currently running",
  },
  {
    label: "Emails Sent",
    key: "emailsSent" as const,
    icon: Send,
    description: "All time",
  },
  {
    label: "Drafts Saved",
    key: "emailsDrafted" as const,
    icon: MailCheck,
    description: "All time",
  },
];

export function StatsCards({ stats }: Props) {
  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats[c.key]}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {c.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

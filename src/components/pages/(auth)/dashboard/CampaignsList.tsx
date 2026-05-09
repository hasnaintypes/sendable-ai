"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Plus, Rocket } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

type Campaign = Doc<"campaigns">;

interface Props {
  campaigns: Campaign[] | undefined;
}

const STATUS_LABELS: Record<Campaign["status"], string> = {
  draft: "Draft",
  queued: "Queued",
  discovering: "Discovering",
  running: "Running",
  paused: "Paused",
  completed: "Completed",
  failed: "Failed",
  canceled: "Canceled",
};

const STATUS_VARIANT: Record<
  Campaign["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  queued: "secondary",
  discovering: "secondary",
  running: "default",
  paused: "outline",
  completed: "secondary",
  failed: "destructive",
  canceled: "outline",
};

const TYPE_LABELS: Record<Campaign["campaignType"], string> = {
  cold_outreach: "Cold Outreach",
  recruiting: "Recruiting",
  networking: "Networking",
  partnerships: "Partnerships",
  investor_outreach: "Investor Outreach",
  job_application: "Job Application",
  product_marketing: "Product Marketing",
};

function progressPercent(c: Campaign): number {
  if (c.emailLimit === 0) return 0;
  const done = c.emailsSent + c.emailsDrafted + c.emailsFailed;
  return Math.min(100, Math.round((done / c.emailLimit) * 100));
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="rounded-full bg-muted p-4">
        <Rocket className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-lg">No campaigns yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first AI-powered outreach campaign to get started.
        </p>
      </div>
      <Button asChild>
        <Link href="/campaigns/new">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Link>
      </Button>
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const pct = progressPercent(campaign);
  const isActive = ["discovering", "running", "queued"].includes(
    campaign.status
  );

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium truncate">{campaign.name}</p>
          <Badge variant={STATUS_VARIANT[campaign.status]}>
            {STATUS_LABELS[campaign.status]}
          </Badge>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            {TYPE_LABELS[campaign.campaignType]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {campaign.goal}
        </p>
        {isActive && (
          <div className="mt-2 flex items-center gap-2">
            <Progress value={pct} className="h-1.5 flex-1 max-w-xs" />
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
        )}
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-medium">{campaign.emailsSent} sent</p>
        <p className="text-xs text-muted-foreground">
          {campaign.emailsDrafted} drafted
        </p>
      </div>
    </div>
  );
}

export function CampaignsList({ campaigns }: Props) {
  if (!campaigns) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-72" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Campaigns</CardTitle>
        {campaigns.length > 0 && (
          <Button size="sm" asChild>
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {campaigns.slice(0, 10).map((c) => (
              <CampaignRow key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

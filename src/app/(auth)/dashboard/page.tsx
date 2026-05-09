"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StatsCards } from "@/components/pages/(auth)/dashboard/StatsCards";
import { CampaignsList } from "@/components/pages/(auth)/dashboard/CampaignsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const campaigns = useQuery(api.campaigns.queries.list);
  const stats = useQuery(api.campaigns.queries.stats);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your outreach campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      <StatsCards stats={stats} />
      <CampaignsList campaigns={campaigns} />
    </div>
  );
}

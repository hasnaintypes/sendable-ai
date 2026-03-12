"use client";

import { api } from "@/convex/_generated/api";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Preloaded } from "convex/react";
import { CommandMenu } from "@/components/shared/CommandMenu";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { UserMenu } from "@/components/shared/UserMenu";

export const AppHeader = ({
  preloadedUserQuery,
}: {
  preloadedUserQuery: Preloaded<typeof api.auth.queries.getCurrentUser>;
}) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <div className="flex-1 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <CommandMenu />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <NotificationCenter />
          <Separator orientation="vertical" className="h-6" />
          <UserMenu preloadedUserQuery={preloadedUserQuery} />
        </div>
      </div>
    </header>
  );
};

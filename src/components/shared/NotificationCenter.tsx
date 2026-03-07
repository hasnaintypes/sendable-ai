"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationCenter() {
  const [unreadCount] = React.useState(3);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-sm">New lead response</span>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <p className="text-xs text-muted-foreground">
              John Doe replied to your cold email campaign
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-sm">Campaign completed</span>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your &quot;Spring Outreach&quot; campaign has finished
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-sm">Integration connected</span>
              <span className="text-xs text-muted-foreground">3h ago</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Gmail successfully connected to your account
            </p>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center text-sm text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { IconBell } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "@/lib/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsPanel } from "@/components/notifications-panel";

const POLL_INTERVAL_MS = 45_000;

export function NotificationsBell() {
  const { data } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: POLL_INTERVAL_MS,
  });

  const unreadCount = data?.unread_count ?? 0;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <IconBell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center p-0 text-[10px]"
            >
              {displayCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto p-0">
        <NotificationsPanel />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

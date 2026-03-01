"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/lib/notifications";
import type { NotificationData } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString();
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: NotificationData;
  onMarkRead: (id: string) => void;
}) {
  const isUnread = !notification.read_at;
  const title = (notification.data?.title as string) ?? "Notification";
  const body = (notification.data?.body as string) ?? "";
  const actionUrl = notification.data?.action_url as string | undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50",
        isUnread && "bg-accent/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={cn("truncate", isUnread && "font-medium")}>{title}</p>
          {body && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {body}
            </p>
          )}
        </div>
        {isUnread && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="shrink-0"
            onClick={() => onMarkRead(notification.id)}
          >
            Mark read
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-xs">
        {formatRelativeTime(notification.created_at)}
      </p>
      {actionUrl && (
        <Link
          href={actionUrl}
          className="mt-1 text-xs text-primary hover:underline"
        >
          View
        </Link>
      )}
    </div>
  );
}

export function NotificationsPanel({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ per_page: 20 }),
  });

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
  });

  const unreadCount = unreadData?.unread_count ?? 0;

  async function handleMarkAsRead(id: string) {
    await markAsRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  }

  async function handleMarkAllAsRead() {
    await markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  }

  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleMarkAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <p>Failed to load notifications.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && (!data?.data?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-1">
            {data?.data?.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={handleMarkAsRead}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

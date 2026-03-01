import { apiGet, apiPatch, apiPost } from "./api";
import type { NotificationData, UnreadCountData } from "@/types";

export type PaginatedNotifications = {
  data: NotificationData[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
};

export async function getNotifications(params?: {
  page?: number;
  per_page?: number;
}): Promise<PaginatedNotifications> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  const query = searchParams.toString();
  const path = query ? `/api/v1/notifications?${query}` : "/api/v1/notifications";
  return apiGet<PaginatedNotifications>(path);
}

export async function getUnreadCount(): Promise<UnreadCountData> {
  return apiGet<UnreadCountData>("/api/v1/notifications/unread-count");
}

export async function markAsRead(id: string): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`/api/v1/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<{ message: string }> {
  return apiPatch<{ message: string }>("/api/v1/notifications/read-all");
}

export async function sendDemoNotification(): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/api/v1/notifications/demo");
}

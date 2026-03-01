"use client";

import { useState } from "react";
import { sendDemoNotification } from "@/lib/notifications";
import {
  toastError,
  toastInfo,
  toastSuccess,
  toastWarning,
  showApiError,
} from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationsBell } from "@/components/notifications-bell";

export default function NotificationsDemoPage() {
  const [sending, setSending] = useState(false);

  async function handleSendDemo() {
    setSending(true);
    try {
      await sendDemoNotification();
      toastSuccess("Demo notification sent. Check the bell icon.");
    } catch (err) {
      if (err instanceof ApiError) {
        showApiError(err);
      } else {
        toastError("Failed to send demo notification.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Notifications Demo</h1>
      <p className="mt-2 text-muted-foreground">
        Toast = ephemeral feedback (success, error, warning, info). Bell =
        server-stored notifications fetched from the API.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Toast Types</CardTitle>
            <CardDescription>
              Each type has distinct styling: success (green), error (red),
              warning (amber), info (blue).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toastSuccess("Operation completed successfully.")}
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toastError("Something went wrong.")}
            >
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toastWarning("Please review before continuing.")}
            >
              Warning
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toastInfo("Here's some helpful information.")}
            >
              Info
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Demo Notification</CardTitle>
            <CardDescription>
              Triggers a demo notification from the API. It will appear in the
              bell panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSendDemo} disabled={sending}>
              {sending ? "Sending..." : "Send demo notification"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notifications Bell</CardTitle>
            <CardDescription>
              Click the bell in the header to open the panel. Or use this one:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationsBell />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

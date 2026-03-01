"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { UserData } from "@/types";

async function fetchUser(): Promise<UserData> {
  return apiGet<UserData>("/api/v1/user");
}

export default function QueryExamplePage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return (
    <>
      <Link
        href="/dashboard/examples"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to examples
      </Link>
      <h1 className="text-2xl font-semibold">TanStack Query</h1>
      <p className="mt-2 text-muted-foreground">
        Fetches the current user from{" "}
        <code className="rounded bg-muted px-1">/api/v1/user</code>. Shows
        loading, error, and success states.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        {isPending && (
          <p className="text-muted-foreground">Loading user...</p>
        )}
        {isError && (
          <div>
            <p className="font-medium text-destructive">
              Error: {error?.message ?? "Failed to fetch"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}
        {data && (
          <div>
            <p className="font-medium">{data.name}</p>
            <p className="text-sm text-muted-foreground">{data.email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Refetch
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

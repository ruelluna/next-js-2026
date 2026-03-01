"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { User } from "@/lib/auth";

async function fetchUser(): Promise<User> {
  return apiGet<User>("/api/v1/user");
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
        className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to examples
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        TanStack Query
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Fetches the current user from <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">/api/v1/user</code>.
        Shows loading, error, and success states.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {isPending && (
          <p className="text-zinc-500">Loading user...</p>
        )}
        {isError && (
          <div>
            <p className="font-medium text-red-600 dark:text-red-400">
              Error: {error?.message ?? "Failed to fetch"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Retry
            </button>
          </div>
        )}
        {data && (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {data.name}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {data.email}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Refetch
            </button>
          </div>
        )}
      </div>
    </>
  );
}

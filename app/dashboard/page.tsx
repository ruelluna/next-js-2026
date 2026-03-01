"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Welcome, {user?.name}. You are authenticated.
      </p>
      <p className="mt-4">
        <Link
          href="/dashboard/examples"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View package examples →
        </Link>
      </p>
    </>
  );
}

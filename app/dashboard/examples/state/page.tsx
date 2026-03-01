"use client";

import { useUiStore } from "@/stores/ui";
import Link from "next/link";

export default function StateExamplePage() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <>
      <Link
        href="/dashboard/examples"
        className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to examples
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Zustand
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Client UI state with persistence. Sidebar and theme are stored in
        localStorage via the persist middleware.
      </p>

      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
            Sidebar state
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Current: <strong>{sidebarOpen ? "Open" : "Closed"}</strong>
          </p>
          <button
            onClick={toggleSidebar}
            className="mt-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Toggle sidebar
          </button>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
            Theme
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Current: <strong>{theme}</strong>
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setTheme("light")}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Dark
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Note: Theme is stored in Zustand. To apply it globally, wire
            setTheme to document.documentElement.classList or a theme provider.
          </p>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui";

export default function StateExamplePage() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <>
      <Link
        href="/dashboard/examples"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to examples
      </Link>
      <h1 className="text-2xl font-semibold">Zustand</h1>
      <p className="mt-2 text-muted-foreground">
        Client UI state with persistence. Sidebar and theme are stored in
        localStorage via the persist middleware.
      </p>

      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-medium">Sidebar state</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current: <strong>{sidebarOpen ? "Open" : "Closed"}</strong>
          </p>
          <Button variant="outline" size="sm" onClick={toggleSidebar} className="mt-2">
            Toggle sidebar
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-medium">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current: <strong>{theme}</strong>
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Note: Theme is stored in Zustand. To apply it globally, wire
            setTheme to document.documentElement.classList or a theme provider.
          </p>
        </div>
      </div>
    </>
  );
}

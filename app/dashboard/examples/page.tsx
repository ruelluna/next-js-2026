import Link from "next/link";

const demos = [
  {
    href: "/dashboard/examples/query",
    title: "TanStack Query",
    description: "Fetch data from API, loading and error states, optional mutations.",
  },
  {
    href: "/dashboard/examples/form",
    title: "TanStack Form + Zod",
    description: "Form with validation schema and submit handler.",
  },
  {
    href: "/dashboard/examples/table",
    title: "TanStack Table",
    description: "Data table with sorting, filtering, and pagination.",
  },
  {
    href: "/dashboard/examples/state",
    title: "Zustand",
    description: "Client UI state: sidebar, theme, counter with persistence.",
  },
  {
    href: "/dashboard/examples/notifications",
    title: "Notifications",
    description: "Toast messages and server-backed notifications panel with bell.",
  },
];

export default function ExamplesIndexPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Package Examples</h1>
      <p className="mt-2 text-muted-foreground">
        Sample pages demonstrating each frontend package. See{" "}
        <code className="rounded bg-muted px-1">docs/PACKAGES.md</code> for
        documentation.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link
              href={demo.href}
              className="block rounded-lg border border-border bg-card p-4 transition hover:border-border/80 hover:shadow-md"
            >
              <h2 className="font-medium">{demo.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {demo.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

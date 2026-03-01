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
];

export default function ExamplesIndexPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Package Examples
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sample pages demonstrating each frontend package. See{" "}
        <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
          docs/PACKAGES.md
        </code>{" "}
        for documentation.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link
              href={demo.href}
              className="block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
                {demo.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {demo.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

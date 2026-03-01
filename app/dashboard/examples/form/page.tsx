"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Link from "next/link";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ItemForm = z.infer<typeof itemSchema>;

function validateForm(values: ItemForm):
  | { fields: Record<string, string> }
  | undefined {
  const result = itemSchema.safeParse(values);
  if (result.success) return undefined;
  const fields: Record<string, string> = {};
  result.error.issues.forEach((e) => {
    const path = e.path.join(".");
    if (path && !fields[path]) fields[path] = e.message;
  });
  return { fields };
}

export default function FormExamplePage() {
  const form = useForm({
    defaultValues: { name: "", description: "" },
    validators: {
      onChange: ({ value }) => validateForm(value) ?? undefined,
    },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
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
        TanStack Form + Zod
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Form with Zod schema validation. On submit, values are validated and
        shown in an alert.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mt-6 max-w-md space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Name
              </label>
              <input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
              {field.state.meta.errors?.length ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={3}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={form.state.isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {form.state.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}

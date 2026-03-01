"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to examples
      </Link>
      <h1 className="text-2xl font-semibold">TanStack Form + Zod</h1>
      <p className="mt-2 text-muted-foreground">
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
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors?.length ? (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
}

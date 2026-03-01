# Frontend Packages

This document describes the core packages used in the frontend and when to use each.

## Overview

| State / Concern | Package | Use For |
|-----------------|---------|---------|
| Server state (API data) | TanStack Query | Fetching, caching, mutations for Laravel API |
| Form state | TanStack Form | Form fields, validation, submission |
| Tables | TanStack Table | Data tables with sorting, filtering, pagination |
| Validation | Zod | Form schemas, API response validation |
| Client UI state | Zustand | Sidebar, theme, preferences |

---

## TanStack Query

**Purpose:** Server state management. Handles data from the Laravel API.

### When to use

- **`useQuery`** – Fetching data (GET). Use for lists, details, any read-only API call.
- **`useMutation`** – Creating, updating, deleting. Use for POST, PUT, PATCH, DELETE.

### Key concepts

- **Query keys** – Unique identifiers for cached data. Use arrays: `['users']`, `['user', id]`.
- **Invalidation** – After a mutation, invalidate related queries so they refetch: `queryClient.invalidateQueries({ queryKey: ['users'] })`.
- **Stale time** – How long data is considered fresh. Default is 0; we set 60s in the provider.

### Laravel API integration

Use `apiFetch`, `apiGet`, `apiPost` from `@/lib/api` as your `queryFn` / `mutationFn`:

```tsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ['user'],
  queryFn: () => apiGet<User>('/api/v1/user'),
});
```

---

## TanStack Form

**Purpose:** Form state, validation, and submission.

### When to use

- Any form: login, create/edit entities, settings.
- Works with Zod for schema validation.

### Key concepts

- **`useForm`** – Creates form instance with default values and validation.
- **Field components** – Bind inputs via `form.Field` with `children` as render prop.
- **Submission** – `form.handleSubmit` runs validation, then your handler. Pair with `useMutation` for API calls.

### Example

```tsx
const form = useForm({
  defaultValues: { name: '', email: '' },
  validators: { onChange: itemSchema },
  onSubmit: async ({ value }) => {
    await createItemMutation.mutateAsync(value);
  },
});
```

---

## TanStack Table

**Purpose:** Headless data tables with sorting, filtering, pagination.

### When to use

- Lists of entities (users, products, orders).
- When you need column sorting, filters, or pagination.

### Key concepts

- **Column definitions** – Define `accessorKey`, `header`, `cell` for each column.
- **`useReactTable`** – Pass columns, data, and feature options (sorting, filtering, etc.).
- **`getHeaderGroups`, `getRowModel`** – Render the table from the table instance.

### Client vs server data

- **Client-side** – Pass full data array; table handles sorting/filtering in memory.
- **Server-side** – Fetch paginated data with `useQuery`; pass sort/filter params to the API.

---

## Zod

**Purpose:** Schema validation and type inference.

### When to use

- Form validation (with TanStack Form).
- Validating API responses before use.
- Shared types between frontend and Laravel (manual alignment).

### Key concepts

- **`z.object()`** – Object schemas.
- **`z.string()`, `z.number()`, etc.** – Primitive validators with `.min()`, `.email()`, etc.
- **`z.infer<typeof schema>`** – Extract TypeScript type from schema.

### Example

```tsx
const itemSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});
type Item = z.infer<typeof itemSchema>;
```

---

## Zustand

**Purpose:** Client-side UI state that needs to be shared across components.

### When to use

- Sidebar open/closed.
- Theme (light/dark).
- Global filters or preferences.
- State that should persist (e.g. `persist` middleware).

### When not to use

- Server data → use TanStack Query.
- Form state → use TanStack Form.
- Local component state → use `useState`.

### Key concepts

- **`create`** – Define store with state and actions.
- **`useStore(selector)`** – Subscribe to specific state; component re-renders when it changes.
- **`persist`** – Persist store to localStorage.

### Example

```tsx
const sidebarOpen = useUiStore((s) => s.sidebarOpen);
const toggleSidebar = useUiStore((s) => s.toggleSidebar);
```

---

## Demo Pages

Sample implementations are available at:

- `/dashboard/examples` – Index with links to all demos
- `/dashboard/examples/query` – TanStack Query
- `/dashboard/examples/form` – TanStack Form + Zod
- `/dashboard/examples/table` – TanStack Table
- `/dashboard/examples/state` – Zustand

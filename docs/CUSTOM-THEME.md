# Building Custom Theme Components

This guide is for team members building reusable components. We **extend** shadcn/ui components; we do **not** override them. shadcn components in `components/ui/` stay as-is so we can update them safely.

## Overview

**Theme** here means:

1. **Global tokens** – Colors, radius, spacing (via CSS variables in `globals.css`)
2. **Extended components** – Custom components in `components/custom/` that wrap shadcn and add project-specific styling or behavior

See [THEME.md](./THEME.md) for preset options (style, base color, radius). This doc focuses on **extending components**.

---

## 1. Global Theme Tokens

Theme tokens live in `app/globals.css`:

- **`:root`** – Light mode colors, `--radius`, etc.
- **`.dark`** – Dark mode overrides

To add a custom token (e.g., a brand color):

```css
:root {
  --radius: 0.625rem;
  --brand: oklch(0.6 0.2 250);
  --brand-foreground: oklch(0.98 0 0);
}

@theme inline {
  --color-brand: var(--brand);
}
```

Then use `bg-brand` or `text-brand` in Tailwind.

---

## 2. Extending shadcn Components

We extend by **wrapping** shadcn components. Do not edit files in `components/ui/`.

### Wrapper Component Pattern

Create a custom component that wraps the shadcn component and adds your props, defaults, or styling.

**Example – custom button with height and width:**

```tsx
// components/custom/button.tsx
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  size?: "default" | "sm" | "lg" | "square";
};

const sizeClasses = {
  default: "h-10 w-32",
  sm: "h-8 w-24",
  lg: "h-12 w-40",
  square: "h-10 w-10",
};

export function Button({ className, size = "default", ...props }: ButtonProps) {
  return (
    <ShadcnButton
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}
```

Import your `Button` from `@/components/custom/button` where you need the extended behavior.

### One-off Styling via `className`

For a single use case, pass `className` to the shadcn component:

```tsx
import { Button } from "@/components/ui/button";

<Button className="h-14 w-48">Custom size</Button>
```

No wrapper needed. The shadcn `Button` accepts `className` and merges it.

---

## 3. Example: Custom Button with Height and Width

### Wrapper with design tokens

```tsx
// components/custom/button.tsx
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HEIGHTS = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
} as const;

const WIDTHS = {
  auto: "w-auto",
  full: "w-full",
  sm: "min-w-24",
  md: "min-w-32",
  lg: "min-w-40",
} as const;

type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  height?: keyof typeof HEIGHTS;
  width?: keyof typeof WIDTHS;
};

export function Button({
  height = "md",
  width = "auto",
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={cn(HEIGHTS[height], WIDTHS[width], className)}
      {...props}
    />
  );
}
```

Usage:

```tsx
import { Button } from "@/components/custom/button";

<Button height="lg" width="full">Submit</Button>
```

---

## 4. Applying the Same Pattern to Other Components

| Component | Extend by | Example |
|-----------|-----------|---------|
| **Input** | Wrapper with `height`, `width` props | `components/custom/input.tsx` |
| **Card** | Wrapper with `padding`, `variant` props | `components/custom/card.tsx` |
| **Badge** | Wrapper with custom `size` options | `components/custom/badge.tsx` |
| **Select** | Wrapper with trigger dimensions | `components/custom/select.tsx` |

Flow:

1. Create a wrapper in `components/custom/`.
2. Import the shadcn component from `@/components/ui/`.
3. Add your props, map them to Tailwind classes, merge with `className`.
4. Export and use your wrapper. Import from `@/components/custom/your-component`.

---

## 5. Best Practices

1. **Extend, never override** – Keep `components/ui/` unchanged.
2. **Use design tokens** – Reference `var(--radius)`, `var(--primary)` instead of hardcoding values.
3. **Use `cn()`** – Merge `className` so callers can still customize.
4. **Document extended props** – Add JSDoc or a short comment for new props.
5. **Avoid `!important`** – Fix specificity with more specific selectors or `@layer` instead.
6. **Use `className` for one-offs** – No wrapper needed when it’s a single use case.

---

## 6. File Structure

```
components/
├── ui/              # shadcn components – do not edit
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── custom/          # extended components – wrappers around shadcn
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
└── ...
```

Import extended components from `@/components/custom/button`, `@/components/custom/input`, etc. Import base shadcn components from `@/components/ui/` when you need the raw component without extensions.

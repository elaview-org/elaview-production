# Error Handling

Next.js App Router error handling patterns.

## Error Types

| Type                  | Pattern         | File               |
|-----------------------|-----------------|--------------------|
| Validation failures   | Return as value | —                  |
| API errors (expected) | Return as value | —                  |
| Not found             | `notFound()`    | `not-found.tsx`    |
| Rendering exceptions  | Error boundary  | `error.tsx`        |
| Root layout errors    | Global boundary | `global-error.tsx` |

## Expected Errors

Return errors as values. Never throw.

### Server Actions

```tsx
"use server";

export async function createBooking(prevState: ActionState, formData: FormData) {
  const res = await fetch("/api/bookings", { method: "POST", body: formData });

  if (!res.ok) {
    return { success: false, message: "Failed to create booking" };
  }

  revalidatePath("/bookings");
  redirect("/bookings");
}
```

### Server Components

```tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/data");

  if (!res.ok) {
    return <ErrorMessage message="Failed to load data" />;
  }

  return <DataDisplay data={await res.json()} />;
}
```

### Not Found

```tsx
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const item = await getItem(params.id);
  if (!item) notFound();
  return <ItemDetail item={item} />;
}
```

## Error Boundaries

Catch uncaught exceptions with `error.tsx`. Must be a client component.

### Standard Pattern

```tsx
"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return <ErrorState onAction={reset} />;
}
```

### global-error.tsx

Catches root layout failures. Must define `<html>` and `<body>`.

```tsx
"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: Props) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center">
        <ErrorState onAction={reset} />
      </body>
    </html>
  );
}
```

### Boundary Hierarchy

```
global-error.tsx ─────────────── Root layout failures (last resort)
    │
app/error.tsx ────────────────── (auth), (home), (public) pages
    │
(dashboard)/error.tsx ────────── Dashboard layout failures
    │
├── @admin/error.tsx ─────────── Admin slot isolation
├── @advertiser/error.tsx ────── Advertiser slot isolation
├── @marketing/error.tsx ─────── Marketing slot isolation
└── @spaceOwner/error.tsx ────── SpaceOwner slot isolation
```

### Behavior

- Catches errors from `page.tsx` and nested children
- Does NOT catch errors from `layout.tsx` at the same level
- Errors bubble up to the nearest parent boundary
- Higher boundaries catch more, lower boundaries isolate more

## ErrorState Props

| Prop          | Type         | Default                              |
|---------------|--------------|--------------------------------------|
| `image`       | `string`     | `"/common/error.svg"`                |
| `title`       | `string`     | `"Something went wrong"`             |
| `message`     | `string`     | `"We couldn't load this content..."` |
| `actionLabel` | `string`     | `"Try again"`                        |
| `onAction`    | `() => void` | —                                    |
| `className`   | `string`     | —                                    |

## Reset Behavior

`reset()` re-renders the boundary contents.

**Works for:** transient network failures, rate limiting, temporary unavailability

**Does not help with:** persistent data issues, code bugs, invalid state requiring user action

## References

- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [error.tsx Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error)

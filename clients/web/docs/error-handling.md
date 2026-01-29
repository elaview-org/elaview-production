# Error Handling

Next.js App Router error handling patterns and conventions.

## Error Classification

All errors fall into two categories:

**User-facing** — errors the user needs to know about. Displayed via toast or inline form validation.
- Validation failures (invalid form input)
- Failed mutations (booking creation failed, payment error)
- Permission errors (unauthorized action)

**Internal** — errors for observability only. Handled by error boundaries for UI recovery and server-side logging. Never surfaced as raw messages to users.
- Network failures (logged server-side)
- Unexpected exceptions (caught by error boundaries)
- Third-party service errors (Stripe, Cloudflare)

## User-Facing Errors — Toast

Component: `<Toaster>` from `@/components/primitives/sonner` (shadcn/ui wrapper around [sonner](https://sonner.emilkowal.dev/))

API: `toast.error()`, `toast.success()`, `toast.warning()` from `sonner`

**Prerequisite:** `<Toaster>` must be mounted in the root layout (`app/layout.tsx`). It is not yet mounted — add it when implementing toast-based error handling.

### Server Actions

Return `ActionState` with `success: false` on failure. The client component calls `toast.error()` in a `useEffect` reacting to state changes.

```tsx
"use server";

export default async function createBooking(
  prevState: ActionState<Booking>,
  formData: FormData
) {
  const { data, error } = await api.mutate({ mutation: graphql(`...`) });

  if (error) {
    return { success: false, message: error.message, data: prevState.data };
  }

  revalidatePath("/bookings");
  redirect("/bookings");
}
```

```tsx
"use client";

import { toast } from "sonner";

export default function BookingForm({ data }: Props) {
  const [state, action, pending] = useActionState(createBooking, initialState);

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return <form action={action}>{/* fields */}</form>;
}
```

### Client Mutations

Call `toast.error()` directly in the catch block.

```tsx
async function handleDelete() {
  try {
    await deleteMutation({ variables: { id } });
    toast.success("Booking deleted");
  } catch (error) {
    toast.error("Failed to delete booking");
  }
}
```

### Toast vs Inline

| Scenario | Method | Component |
|---|---|---|
| Transient feedback (action succeeded/failed) | Toast | `toast.success()` / `toast.error()` |
| Permission denied | Toast | `toast.error()` |
| Form field validation | Inline | `<FieldDescription>` / `<FieldError>` |

## User-Facing Errors — Inline Validation

Use existing `<Field>`, `<FieldDescription>`, and `<FieldError>` primitives from `@/components/primitives/field` for field-level errors shown next to the input.

```tsx
<Field data-invalid={!!errors.email}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" name="email" aria-invalid={!!errors.email} />
  {errors.email && (
    <FieldError>{errors.email}</FieldError>
  )}
</Field>
```

`<FieldError>` renders with `role="alert"` for accessibility.

## Error Boundaries

Catch uncaught exceptions with `error.tsx`. Must be a client component. Error boundaries are for UI recovery only — not a logging point.

- **Server errors:** Next.js logs full details server-side automatically; the client receives a sanitized error with `digest`
- **Client rendering errors:** visible in browser devtools; no custom logging system needed

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

## Not Found

```tsx
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const item = await getItem(params.id);
  if (!item) notFound();
  return <ItemDetail item={item} />;
}
```

## ErrorState Props

| Prop | Type | Default |
|---|---|---|
| `image` | `string` | `"/common/error.svg"` |
| `title` | `string` | `"Something went wrong"` |
| `message` | `string` | `"We couldn't load this content..."` |
| `actionLabel` | `string` | `"Try again"` |
| `onAction` | `() => void` | — |
| `className` | `string` | — |

## Reset Behavior

`reset()` re-renders the boundary contents.

**Works for:** transient network failures, rate limiting, temporary unavailability

**Does not help with:** persistent data issues, code bugs, invalid state requiring user action

## Decision Table

| Error Type | Display | Component |
|---|---|---|
| Form field validation | Inline | `<FieldError>` |
| Action failure (user should know) | Toast | `toast.error()` via sonner |
| Action success | Toast | `toast.success()` via sonner |
| Page data fetch failure | Error boundary | `<ErrorState>` |
| Resource not found | Not found page | `notFound()` |
| Unexpected crash | Error boundary | `<ErrorState>` |

## References

- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [error.tsx Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Sonner Documentation](https://sonner.emilkowal.dev/)

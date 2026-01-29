# Logging

Server-only logging specification using pino. No client-side logging system — client errors are handled by error boundaries (UI) and browser devtools (development).

## Library

[pino](https://github.com/pinojs/pino) — fast, structured JSON logger for Node.js.

Already on Next.js's `serverExternalPackages` built-in list, so no `next.config.ts` changes are needed.

**Dependencies:**
- `pino` — runtime
- `pino-pretty` — dev dependency (human-readable output in development)

## Logger Location

Single pino instance at `lib/logger.ts`. Imported in Server Components, Server Actions, and Route Handlers only.

```ts
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "warn" : "debug"),
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
});

export default logger;
```

## Log Levels

| Level | Usage | Environments |
|---|---|---|
| `debug` | Detailed diagnostic info (query params, payloads) | development only |
| `info` | Significant operations (booking created, payment processed) | development, staging |
| `warn` | Recoverable issues (fallback to mock data, retry succeeded) | all |
| `error` | Failures requiring attention (mutation failed, external service down) | all |

## Environment Behavior

| Environment | Min Level | Transport | Format |
|---|---|---|---|
| development | `debug` | `pino-pretty` (stdout) | Human-readable, colorized |
| staging | `info` | stdout | JSON (structured) |
| production | `warn` | stdout | JSON (structured) |

Environment detection uses `process.env.NODE_ENV` (available in all Next.js server contexts). Staging and production both run as production builds — use the `LOG_LEVEL` env var to override when needed (e.g., `LOG_LEVEL=info` for staging).

## Contextual Logging

Use child loggers to add module context:

```ts
import logger from "@/lib/logger";

const log = logger.child({ module: "bookings" });

log.info({ bookingId }, "Booking created");
log.error({ bookingId, error: error.message }, "Failed to update booking status");
```

## Integration with Error Handling

### Server Actions

Log the error before returning `ActionState` with `success: false`:

```ts
"use server";

import logger from "@/lib/logger";

const log = logger.child({ module: "bookings" });

export default async function createBooking(
  prevState: ActionState<Booking>,
  formData: FormData
) {
  const { data, error } = await api.mutate({ mutation: graphql(`...`) });

  if (error) {
    log.error({ error: error.message }, "Failed to create booking");
    return { success: false, message: error.message, data: prevState.data };
  }

  log.info({ bookingId: data.createBooking.id }, "Booking created");
  revalidatePath("/bookings");
  redirect("/bookings");
}
```

### Server Components

Log the error when data fetching fails:

```ts
import logger from "@/lib/logger";

const log = logger.child({ module: "spaces" });

export default async function Page() {
  const { data, error } = await api.query({ query: graphql(`...`) });

  if (error) {
    log.error({ error: error.message }, "Failed to load spaces");
  }

  return <SpaceList data={data} />;
}
```

### Route Handlers

Log before returning error responses:

```ts
import logger from "@/lib/logger";

const log = logger.child({ module: "api" });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({ success: true });
  } catch (error) {
    log.error({ error: (error as Error).message }, "Route handler failed");
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
```

## What NOT to Log

- Sensitive data (passwords, tokens, full credit card numbers, PII)
- Request/response bodies in production (use `debug` level for development)
- Client-side events (that's analytics, not logging)
- Successful GET requests (Next.js handles request logging)

## References

- [pino Documentation](https://getpino.io/)
- [pino-pretty](https://github.com/pinojs/pino-pretty)
- [Next.js serverExternalPackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)

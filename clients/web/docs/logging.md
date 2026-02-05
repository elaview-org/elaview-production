# Logging

Server-only logging specification using pino. No client-side logging system — client errors are handled by error boundaries (UI) and browser devtools (development).

## Library

[pino](https://github.com/pinojs/pino) — fast, structured JSON logger for Node.js.

Listed in `serverExternalPackages` in `next.config.ts` to prevent Next.js from bundling them (required for pino's worker threads and native stream handling).

**Dependencies:**
- `pino` — runtime
- `pino-pretty` — dev dependency (human-readable output in development)

## Logger Location

Single pino instance at `src/lib/logger.ts`. Imported in Server Components, Server Actions, and Route Handlers only.

```ts
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "warn" : "debug"),
  timestamp: pino.stdTimeFunctions.isoTime,
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

## Instrumentation (`src/instrumentation.ts`)

### Console Override

`register()` overrides `globalThis.console` methods (`log`, `info`, `warn`, `error`, `debug`) to route all output — including third-party library warnings during SSR — through pino as structured JSON. This ensures every log entry has a consistent format with ISO timestamps.

### Request Error Reporting

`onRequestError()` captures server-side errors with full Next.js routing context. This covers errors in Server Components, Route Handlers, Server Actions, and the proxy — including errors that bypass our Apollo logging link (e.g., render failures, abort signals).

```
[11:18:11] ERROR (nextjs): request error
    message: "This operation was aborted"
    digest: "abc123"
    path: "/profile"
    method: "GET"
    routerKind: "App Router"
    routePath: "/(dashboard)/@spaceOwner/profile"
    routeType: "render"
    renderSource: "react-server-components"
    revalidateReason: "on-demand"
```

Logged fields:

| Field | Source |
|---|---|
| `message` | Error message |
| `digest` | Next.js error digest (stable identifier for deduplication) |
| `path` | Request path |
| `method` | HTTP method |
| `routerKind` | `"App Router"` or `"Pages Router"` |
| `routePath` | Matched route pattern |
| `routeType` | `"render"`, `"route"`, `"action"`, or `"proxy"` |
| `renderSource` | `"react-server-components"`, `"react-server-components-payload"`, or `"react-client-components"` |
| `revalidateReason` | `"on-demand"`, `"stale"`, or `undefined` (initial render) |

## What NOT to Log

- Sensitive data (passwords, tokens, full credit card numbers, PII)
- Request/response bodies in production (use `debug` level for development)
- Client-side events (that's analytics, not logging)
- Successful GET requests (route hits are logged by the proxy module)

## GraphQL Cache Context

The Apollo logging link (`src/lib/gql/logging-link.ts`) includes cache-related context in each log entry when available:

- `fetchPolicy` — the Apollo fetch policy for the operation (e.g., `cache-first`, `network-only`). Forwarded explicitly via operation context since Apollo consumes it before the link chain runs.
- `cache` — Next.js Data Cache options (`revalidate`, `tags`) when configured via `api.query()`.

```
[10:50:38] DEBUG (graphql): request started
    operation: "SpaceCategories"
    type: "query"
    fetchPolicy: "cache-first"
    cache: { revalidate: 3600, tags: ["space-categories"] }

[10:50:38] DEBUG (graphql): request completed
    operation: "SpaceCategories"
    type: "query"
    duration: "12ms"
```

Two cache layers affect whether and how the link fires:

| Layer | Scope | Link sees it? |
|---|---|---|
| Apollo InMemoryCache | Per-request (SSR client has empty cache) | No — cache hits skip the link chain entirely |
| Next.js Data Cache | Cross-request (`revalidate`/`tags`) | Yes — `fetch()` runs through the link, served from cache |

On the server side, every query hits the network because `registerApolloClient` creates a fresh client per request with an empty InMemoryCache. A fast `duration` value in the "request completed" log indicates a Next.js Data Cache hit rather than a live backend fetch.

## Next.js Built-in Logging

Next.js has its own route/fetch logger that writes directly via `process.stdout.write()` — not through `console.*`. There is no public API to redirect, format, or extend it.

We intercept `process.stdout.write` in `src/instrumentation.ts` to capture this output and route it through pino. The patch strips ANSI escape codes, splits by newline, and logs each non-empty line at `debug` level under the `nextjs` module.

**Why this doesn't cause infinite loops:** Pino writes via SonicBoom (`fs.write(fd=1)`), which bypasses `process.stdout.write` entirely. The console is already overridden to use pino. The only remaining caller of `process.stdout.write` is Next.js itself.

**`next.config.ts` requirements:**
- `logging.fetches.fullUrl: true` — emits fetch sub-logs (route-level logs emit regardless)
- `logging.incomingRequests.ignore` — suppresses logs for static assets and favicon requests (`/_next/static/`, `/favicon.ico`)

```
[12:01:07] DEBUG (nextjs): GET /listings 200 in 150ms (compile: 7ms, proxy.ts: 6ms, render: 137ms)
[12:01:07] DEBUG (nextjs): POST http://localhost:7106/api/graphql 200 in 25ms (cache skip)
[12:01:07] DEBUG (nextjs): Cache skipped reason: (auto no cache)
```

## References

- [pino Documentation](https://getpino.io/)
- [pino-pretty](https://github.com/pinojs/pino-pretty)
- [Next.js serverExternalPackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)

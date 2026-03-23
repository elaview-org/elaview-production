/**
 * Signaling service — main entry point.
 *
 * Hono HTTP server + WebSocket server for real-time device communication.
 * - POST /api/push-schedule  — webhook from .NET backend to push schedules to devices
 * - GET  /health             — health check
 * - GET  /stats              — connection stats
 * - WS   /ws?token=<token>   — device WebSocket connection
 */

import { Hono } from "hono";
import { createServer } from "http";
import { config } from "./lib/config.js";
import { log } from "./lib/logger.js";
import { createWebSocketServer } from "./ws/server.js";
import health from "./routes/health.js";
import pushSchedule from "./routes/push-schedule.js";

const app = new Hono();

// --- HTTP routes ---

app.route("/", health);
app.route("/api", pushSchedule);

// Catch-all 404
app.notFound((c) => c.json({ error: "Not found" }, 404));

// Global error handler
app.onError((err, c) => {
  log.error("Unhandled error", { error: String(err), path: c.req.path });
  return c.json({ error: "Internal server error" }, 500);
});

// --- Start server ---

const httpServer = createServer(async (req, res) => {
  // Hono's fetch adapter — convert Node request to fetch Request and back
  const url = `http://${req.headers.host}${req.url}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await new Promise<Buffer>((resolve) => {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => resolve(Buffer.concat(chunks)));
        })
      : undefined;

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  });

  const response = await app.fetch(request);

  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  const responseBody = await response.arrayBuffer();
  res.end(Buffer.from(responseBody));
});

// Attach WebSocket server to the same HTTP server
createWebSocketServer(httpServer);

httpServer.listen(config.port, () => {
  log.info(`Signaling service started`, {
    port: config.port,
    backendUrl: config.backendUrl,
  });
  log.info(`WebSocket endpoint: ws://localhost:${config.port}/ws`);
  log.info(`Health check: http://localhost:${config.port}/health`);
});

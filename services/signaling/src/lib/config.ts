/**
 * Environment configuration for the signaling service.
 */

export const config = {
  /** Port for the HTTP + WebSocket server */
  port: parseInt(process.env.ELAVIEW_SIGNALING_PORT ?? "8001", 10),

  /** Shared secret for authenticating webhook calls from the .NET backend */
  webhookSecret: process.env.ELAVIEW_SIGNALING_WEBHOOK_SECRET ?? "dev-secret",

  /** Base URL of the .NET backend GraphQL API (for device token validation) */
  backendUrl:
    process.env.ELAVIEW_BACKEND_URL ?? "http://localhost:7106",

  /** Heartbeat interval — devices should ping within this window (ms) */
  heartbeatIntervalMs: 30_000,

  /** Heartbeat timeout — mark device offline if no ping within this (ms) */
  heartbeatTimeoutMs: 90_000,

  /** Log level */
  logLevel: (process.env.LOG_LEVEL ?? "info") as "debug" | "info" | "warn" | "error",
} as const;

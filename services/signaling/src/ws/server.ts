/**
 * WebSocket server — handles device connections, message routing, heartbeats.
 */

import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { Server } from "http";
import { authenticateDevice } from "./auth.js";
import * as connections from "./connections.js";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";
import type { ClientMessage, ServerMessage } from "../lib/types.js";

export function createWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const deviceToken = url.searchParams.get("token");

    if (!deviceToken) {
      sendMessage(ws, { type: "ERROR", message: "Missing device token" });
      ws.close(4000, "Missing device token");
      return;
    }

    // Authenticate
    const authResult = await authenticateDevice(deviceToken);
    if (!authResult) {
      sendMessage(ws, { type: "ERROR", message: "Authentication failed" });
      ws.close(4003, "Authentication failed");
      return;
    }

    // Register
    connections.register(ws, {
      screenId: authResult.screenId,
      deviceToken: authResult.deviceToken,
      deviceId: authResult.deviceId,
    });

    // Handle messages
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as ClientMessage;
        handleClientMessage(ws, msg);
      } catch {
        sendMessage(ws, { type: "ERROR", message: "Invalid message format" });
      }
    });

    ws.on("close", () => {
      connections.unregister(ws);
    });

    ws.on("error", (err) => {
      log.error("WebSocket error", { error: String(err) });
      connections.unregister(ws);
    });

    // Send initial heartbeat ack so the client knows it's connected
    sendMessage(ws, { type: "HEARTBEAT_ACK" });
  });

  // Heartbeat monitor — check for stale connections every 30s
  const heartbeatTimer = setInterval(() => {
    const now = Date.now();
    for (const client of wss.clients) {
      const meta = connections.getMeta(client);
      if (!meta) continue;

      const elapsed = now - meta.lastHeartbeat.getTime();
      if (elapsed > config.heartbeatTimeoutMs) {
        log.info("Device heartbeat timeout, closing", {
          screenId: meta.screenId,
          elapsed,
        });
        connections.unregister(client);
        client.close(4002, "Heartbeat timeout");
      }
    }
  }, config.heartbeatIntervalMs);

  wss.on("close", () => {
    clearInterval(heartbeatTimer);
  });

  log.info("WebSocket server attached", { path: "/ws" });
  return wss;
}

function handleClientMessage(ws: WebSocket, msg: ClientMessage) {
  switch (msg.type) {
    case "HEARTBEAT":
      connections.recordHeartbeat(ws);
      sendMessage(ws, { type: "HEARTBEAT_ACK" });
      break;

    case "PROOF_EVENT":
      // For now just log it — later we'll forward to the backend
      log.info("Proof event received", {
        scheduleId: msg.scheduleId,
        bookingId: msg.bookingId,
        durationSeconds: msg.durationSeconds,
      });
      break;

    default:
      sendMessage(ws, {
        type: "ERROR",
        message: `Unknown message type: ${(msg as { type: string }).type}`,
      });
  }
}

export function sendMessage(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

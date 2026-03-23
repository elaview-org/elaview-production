/**
 * WebSocket connection registry.
 *
 * Maps screenId → Set<WebSocket> so we can push schedule updates
 * to all devices connected to a given screen.
 *
 * Also tracks deviceToken → connection metadata for heartbeat monitoring.
 */

import type { WebSocket } from "ws";
import { log } from "../lib/logger.js";

export interface DeviceConnection {
  ws: WebSocket;
  screenId: string;
  deviceToken: string;
  deviceId: string;
  connectedAt: Date;
  lastHeartbeat: Date;
}

/** screenId → Set of WebSocket connections */
const screenConnections = new Map<string, Set<WebSocket>>();

/** WebSocket → device metadata */
const connectionMeta = new Map<WebSocket, DeviceConnection>();

/** deviceToken → WebSocket (for dedup) */
const tokenToSocket = new Map<string, WebSocket>();

// ── Public API ───────────────────────────────────────────

export function register(ws: WebSocket, meta: Omit<DeviceConnection, "ws" | "connectedAt" | "lastHeartbeat">) {
  const now = new Date();
  const conn: DeviceConnection = { ...meta, ws, connectedAt: now, lastHeartbeat: now };

  // If this device token already has a connection, close the old one
  const existing = tokenToSocket.get(meta.deviceToken);
  if (existing && existing !== ws) {
    log.info("Closing stale connection for device", { deviceToken: meta.deviceToken });
    unregister(existing);
    existing.close(4001, "Superseded by new connection");
  }

  connectionMeta.set(ws, conn);
  tokenToSocket.set(meta.deviceToken, ws);

  if (!screenConnections.has(meta.screenId)) {
    screenConnections.set(meta.screenId, new Set());
  }
  screenConnections.get(meta.screenId)!.add(ws);

  log.info("Device connected", {
    screenId: meta.screenId,
    deviceToken: meta.deviceToken.slice(0, 8) + "...",
  });
}

export function unregister(ws: WebSocket) {
  const meta = connectionMeta.get(ws);
  if (!meta) return;

  connectionMeta.delete(ws);
  tokenToSocket.delete(meta.deviceToken);

  const set = screenConnections.get(meta.screenId);
  if (set) {
    set.delete(ws);
    if (set.size === 0) {
      screenConnections.delete(meta.screenId);
    }
  }

  log.info("Device disconnected", {
    screenId: meta.screenId,
    deviceToken: meta.deviceToken.slice(0, 8) + "...",
  });
}

export function getConnectionsForScreen(screenId: string): Set<WebSocket> {
  return screenConnections.get(screenId) ?? new Set();
}

export function getMeta(ws: WebSocket): DeviceConnection | undefined {
  return connectionMeta.get(ws);
}

export function recordHeartbeat(ws: WebSocket) {
  const meta = connectionMeta.get(ws);
  if (meta) {
    meta.lastHeartbeat = new Date();
  }
}

export function getStats() {
  return {
    totalConnections: connectionMeta.size,
    totalScreens: screenConnections.size,
    screens: Array.from(screenConnections.entries()).map(([id, set]) => ({
      screenId: id,
      deviceCount: set.size,
    })),
  };
}

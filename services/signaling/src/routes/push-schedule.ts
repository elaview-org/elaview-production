/**
 * Push schedule webhook — called by the .NET backend after a booking is confirmed
 * and a digital signage schedule is created.
 *
 * POST /api/push-schedule
 * Authorization: Bearer <webhook-secret>
 * Body: { screenId, schedules: SchedulePayload[] }
 */

import { Hono } from "hono";
import { WebSocket } from "ws";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";
import * as connections from "../ws/connections.js";
import type { SchedulePayload, ServerMessage } from "../lib/types.js";

const pushSchedule = new Hono();

interface PushScheduleBody {
  screenId: string;
  schedules: SchedulePayload[];
}

pushSchedule.post("/push-schedule", async (c) => {
  // Validate webhook secret
  const auth = c.req.header("Authorization");
  const expected = `Bearer ${config.webhookSecret}`;
  if (auth !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json<PushScheduleBody>();
  if (!body.screenId || !Array.isArray(body.schedules)) {
    return c.json({ error: "Invalid payload: screenId and schedules required" }, 400);
  }

  const { screenId, schedules } = body;
  const deviceSockets = connections.getConnectionsForScreen(screenId);

  if (deviceSockets.size === 0) {
    log.info("No devices connected for screen, schedule stored for later", {
      screenId,
      scheduleCount: schedules.length,
    });
    return c.json({
      pushed: false,
      reason: "no_devices_connected",
      screenId,
    });
  }

  const message: ServerMessage = {
    type: "SCHEDULE_UPDATE",
    schedules,
  };

  let pushCount = 0;
  for (const ws of deviceSockets) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      pushCount++;
    }
  }

  log.info("Pushed schedule update to devices", {
    screenId,
    scheduleCount: schedules.length,
    devicesPushed: pushCount,
  });

  return c.json({
    pushed: true,
    screenId,
    scheduleCount: schedules.length,
    devicesPushed: pushCount,
  });
});

export default pushSchedule;

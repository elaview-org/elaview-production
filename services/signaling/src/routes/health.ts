/**
 * Health & stats routes.
 */

import { Hono } from "hono";
import * as connections from "../ws/connections.js";

const health = new Hono();

health.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

health.get("/stats", (c) => {
  return c.json(connections.getStats());
});

export default health;

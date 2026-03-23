/**
 * Simple structured logger.
 */

import { config } from "./config.js";

const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const currentLevel = levels[config.logLevel];

function fmt(level: string, msg: string, data?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${msg}`;
  if (data && Object.keys(data).length > 0) {
    return `${base} ${JSON.stringify(data)}`;
  }
  return base;
}

export const log = {
  debug(msg: string, data?: Record<string, unknown>) {
    if (currentLevel <= levels.debug) console.debug(fmt("debug", msg, data));
  },
  info(msg: string, data?: Record<string, unknown>) {
    if (currentLevel <= levels.info) console.log(fmt("info", msg, data));
  },
  warn(msg: string, data?: Record<string, unknown>) {
    if (currentLevel <= levels.warn) console.warn(fmt("warn", msg, data));
  },
  error(msg: string, data?: Record<string, unknown>) {
    if (currentLevel <= levels.error) console.error(fmt("error", msg, data));
  },
};

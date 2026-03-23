/**
 * useSignaling — WebSocket hook for connecting to the signaling service.
 *
 * - Connects with device token
 * - Sends heartbeats every 25s
 * - Receives schedule updates
 * - Auto-reconnects on disconnect
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { config, deviceStorage } from "../lib/config";
import type { ServerMessage, SchedulePayload, ClientMessage } from "../lib/types";

interface UseSignalingOptions {
  onScheduleUpdate?: (schedules: SchedulePayload[]) => void;
  onScheduleAdded?: (schedule: SchedulePayload) => void;
  onScheduleRemoved?: (scheduleId: string) => void;
  onError?: (message: string) => void;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export function useSignaling(options: UseSignalingOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const connect = useCallback(() => {
    const token = deviceStorage.getToken();
    if (!token) {
      setStatus("error");
      return;
    }

    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus("connecting");
    const ws = new WebSocket(`${config.signalingUrl}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      reconnectAttempts.current = 0;

      // Start heartbeat
      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          const msg: ClientMessage = { type: "HEARTBEAT" };
          ws.send(JSON.stringify(msg));
        }
      }, 25_000); // 25s (server timeout is 90s)
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;

        switch (msg.type) {
          case "SCHEDULE_UPDATE":
            options.onScheduleUpdate?.(msg.schedules);
            break;
          case "SCHEDULE_ADDED":
            options.onScheduleAdded?.(msg.schedule);
            break;
          case "SCHEDULE_REMOVED":
            options.onScheduleRemoved?.(msg.scheduleId);
            break;
          case "HEARTBEAT_ACK":
            // Connection alive
            break;
          case "ERROR":
            options.onError?.(msg.message);
            break;
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = (event) => {
      setStatus("disconnected");
      clearInterval(heartbeatRef.current);

      // Auth failure — don't reconnect
      if (event.code === 4003) {
        setStatus("error");
        return;
      }

      // Exponential backoff reconnect
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
      reconnectAttempts.current++;
      reconnectRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      // onclose will fire after onerror
    };
  }, [options]);

  const sendProofEvent = useCallback(
    (scheduleId: string, bookingId: string, durationSeconds: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const msg: ClientMessage = {
          type: "PROOF_EVENT",
          scheduleId,
          bookingId,
          displayedAt: new Date().toISOString(),
          displayedDurationSeconds: durationSeconds,
        };
        wsRef.current.send(JSON.stringify(msg));
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    clearInterval(heartbeatRef.current);
    clearTimeout(reconnectRef.current);
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(heartbeatRef.current);
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { connect, disconnect, sendProofEvent, status };
}

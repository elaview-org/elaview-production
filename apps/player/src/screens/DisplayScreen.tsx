/**
 * DisplayScreen — fullscreen ad display with schedule rotation.
 *
 * - Connects to signaling service via WebSocket
 * - Receives schedule updates in real time
 * - Rotates through active schedules
 * - Shows idle screen when no schedules are active
 * - Sends proof-of-display events back via WebSocket
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSignaling } from "../hooks/useSignaling";
import { deviceStorage } from "../lib/config";
import type { SchedulePayload } from "../lib/types";

export function DisplayScreen() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<SchedulePayload[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const displayStartRef = useRef<Date>(new Date());

  // Filter to only show active schedules within date range
  const activeSchedules = schedules.filter((s) => {
    const now = new Date();
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    return (
      (s.status === "Active" || s.status === "Pending") &&
      now >= start &&
      now <= end
    );
  });

  const currentSchedule = activeSchedules[currentIndex % activeSchedules.length];

  const { connect, sendProofEvent, status } = useSignaling({
    onScheduleUpdate: (incoming) => {
      setSchedules(incoming);
      setCurrentIndex(0);
    },
    onScheduleAdded: (schedule) => {
      setSchedules((prev) => [...prev, schedule]);
    },
    onScheduleRemoved: (scheduleId) => {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    },
    onError: (message) => {
      console.error("Signaling error:", message);
      if (message === "Authentication failed") {
        deviceStorage.clear();
        navigate("/pair", { replace: true });
      }
    },
  });

  // Connect on mount
  useEffect(() => {
    if (!deviceStorage.isPaired()) {
      navigate("/pair", { replace: true });
      return;
    }
    connect();
  }, [connect, navigate]);

  // Rotation timer
  useEffect(() => {
    if (activeSchedules.length <= 1) return;

    const intervalMs =
      (currentSchedule?.rotationIntervalSeconds ?? 30) * 1000;

    rotationTimer.current = setTimeout(() => {
      // Send proof event for the schedule that just finished displaying
      if (currentSchedule) {
        const durationSeconds =
          (Date.now() - displayStartRef.current.getTime()) / 1000;
        sendProofEvent(
          currentSchedule.id,
          currentSchedule.bookingId ?? "",
          Math.round(durationSeconds)
        );
      }

      setCurrentIndex((prev) => (prev + 1) % activeSchedules.length);
      displayStartRef.current = new Date();
    }, intervalMs);

    return () => clearTimeout(rotationTimer.current);
  }, [currentIndex, activeSchedules.length, currentSchedule, sendProofEvent]);

  // Reset display timer when schedule changes
  useEffect(() => {
    displayStartRef.current = new Date();
  }, [currentIndex]);

  // Handle unpair (long-press escape on keyboard)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        timer = setTimeout(() => {
          deviceStorage.clear();
          navigate("/pair", { replace: true });
        }, 3000); // Hold Escape for 3s to unpair
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearTimeout(timer);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimeout(timer);
    };
  }, [navigate]);

  // --- Render ---

  if (activeSchedules.length === 0) {
    return <IdleScreen status={status} totalSchedules={schedules.length} />;
  }

  if (!currentSchedule) {
    return <IdleScreen status={status} totalSchedules={schedules.length} />;
  }

  if (currentSchedule.creativeType === "Video") {
    return (
      <div style={styles.fullscreen}>
        <video
          key={currentSchedule.id}
          src={currentSchedule.creativeAssetUrl}
          style={styles.media}
          autoPlay
          muted
          loop={activeSchedules.length === 1}
          playsInline
        />
        <StatusIndicator status={status} />
      </div>
    );
  }

  return (
    <div style={styles.fullscreen}>
      <img
        key={currentSchedule.id}
        src={currentSchedule.creativeAssetUrl}
        alt="Advertisement"
        style={styles.media}
      />
      <StatusIndicator status={status} />
    </div>
  );
}

// --- Sub-components ---

function IdleScreen({
  status,
  totalSchedules,
}: {
  status: string;
  totalSchedules: number;
}) {
  return (
    <div style={styles.idle}>
      <div style={styles.idleContent}>
        <div style={styles.logo}>ELAVIEW</div>
        <p style={styles.idleText}>
          {status === "connected"
            ? totalSchedules > 0
              ? "No active schedules right now"
              : "Waiting for ad schedules..."
            : status === "connecting"
            ? "Connecting to server..."
            : "Disconnected — reconnecting..."}
        </p>
        <div
          style={{
            ...styles.statusDot,
            background:
              status === "connected"
                ? "#22c55e"
                : status === "connecting"
                ? "#eab308"
                : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  return (
    <div
      style={{
        ...styles.statusDot,
        position: "fixed",
        bottom: 8,
        right: 8,
        background:
          status === "connected"
            ? "#22c55e"
            : status === "connecting"
            ? "#eab308"
            : "#ef4444",
      }}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  fullscreen: {
    width: "100vw",
    height: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  idle: {
    width: "100vw",
    height: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#fff",
  },
  idleContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    fontSize: "48px",
    fontWeight: 800,
    letterSpacing: "4px",
    opacity: 0.3,
  },
  idleText: {
    fontSize: "16px",
    color: "#666",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
};

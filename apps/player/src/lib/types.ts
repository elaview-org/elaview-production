/**
 * Shared types for the player app — mirrors signaling service types.
 */

export interface SchedulePayload {
  id: string;
  screenId: string;
  bookingId: string | null;
  campaignId: string | null;
  creativeAssetUrl: string;
  creativeType: "Image" | "Video";
  rotationIntervalSeconds: number;
  startDate: string;
  endDate: string;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
}

export type ServerMessage =
  | { type: "SCHEDULE_UPDATE"; schedules: SchedulePayload[] }
  | { type: "SCHEDULE_ADDED"; schedule: SchedulePayload }
  | { type: "SCHEDULE_REMOVED"; scheduleId: string }
  | { type: "HEARTBEAT_ACK" }
  | { type: "ERROR"; message: string };

export type ClientMessage =
  | { type: "HEARTBEAT" }
  | {
      type: "PROOF_EVENT";
      scheduleId: string;
      bookingId: string;
      displayedAt: string;
      displayedDurationSeconds: number;
    };

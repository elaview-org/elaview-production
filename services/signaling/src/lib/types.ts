/**
 * Shared types for the signaling service.
 */

export interface SchedulePayload {
  id: string;
  screenId: string;
  bookingId: string;
  campaignId: string;
  creativeAssetUrl: string;
  creativeType: "IMAGE" | "VIDEO";
  rotationIntervalSeconds: number;
  startDate: string;
  endDate: string;
  status: string;
}

/** Messages sent FROM signaling server TO player device */
export type ServerMessage =
  | { type: "SCHEDULE_UPDATE"; schedules: SchedulePayload[] }
  | { type: "SCHEDULE_ADDED"; schedule: SchedulePayload }
  | { type: "SCHEDULE_REMOVED"; scheduleId: string }
  | { type: "HEARTBEAT_ACK" }
  | { type: "ERROR"; message: string };

/** Messages sent FROM player device TO signaling server */
export type ClientMessage =
  | { type: "HEARTBEAT" }
  | {
      type: "PROOF_EVENT";
      scheduleId: string;
      bookingId: string;
      displayedAt: string;
      durationSeconds: number;
    };

/**
 * Player app configuration — reads from env or localStorage.
 */

export const config = {
  /** Backend GraphQL endpoint for pairing mutations */
  backendUrl: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:7106",

  /** Signaling WebSocket URL */
  signalingUrl: import.meta.env.VITE_SIGNALING_URL ?? "ws://localhost:8001/ws",

  /** GraphQL endpoint path */
  graphqlPath: "/api/graphql",
} as const;

/** Persistent device token storage */
export const deviceStorage = {
  getToken: (): string | null => localStorage.getItem("elaview_device_token"),
  setToken: (token: string) =>
    localStorage.setItem("elaview_device_token", token),
  getScreenId: (): string | null =>
    localStorage.getItem("elaview_screen_id"),
  setScreenId: (id: string) =>
    localStorage.setItem("elaview_screen_id", id),
  clear: () => {
    localStorage.removeItem("elaview_device_token");
    localStorage.removeItem("elaview_screen_id");
  },
  isPaired: (): boolean => !!localStorage.getItem("elaview_device_token"),
};

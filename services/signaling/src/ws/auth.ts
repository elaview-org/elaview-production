/**
 * Device authentication for WebSocket connections.
 *
 * Validates device tokens by querying the .NET backend's GraphQL API.
 * Returns the device + screen info needed to register the connection.
 */

import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";

export interface AuthResult {
  deviceId: string;
  deviceToken: string;
  screenId: string;
}

/**
 * Validates a device token against the backend.
 * The player device sends its token in the WebSocket URL query string.
 *
 * We use a simple GraphQL query to verify the token exists and the device
 * is in an active state.
 */
export async function authenticateDevice(
  deviceToken: string
): Promise<AuthResult | null> {
  if (!deviceToken) return null;

  try {
    // Query the backend to validate the device token
    const query = `
      query ValidateDeviceToken($token: String!) {
        digitalSignageDeviceByToken(token: $token) {
          id
          screenId
          status
        }
      }
    `;

    const res = await fetch(`${config.backendUrl}/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { token: deviceToken },
      }),
    });

    if (!res.ok) {
      log.warn("Backend auth request failed", { status: res.status });
      return null;
    }

    const json = (await res.json()) as {
      data?: {
        digitalSignageDeviceByToken?: {
          id: string;
          screenId: string;
          status: string;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) {
      // If the backend doesn't have this query yet, fall back to
      // trusting the token (for dev/bootstrap purposes)
      log.warn("Backend auth query returned errors, using fallback auth", {
        errors: json.errors.map((e) => e.message),
      });
      return fallbackAuth(deviceToken);
    }

    const device = json.data?.digitalSignageDeviceByToken;
    if (!device) {
      log.warn("Device token not found", {
        token: deviceToken.slice(0, 8) + "...",
      });
      return null;
    }

    if (device.status !== "ONLINE" && device.status !== "Online") {
      log.warn("Device not in online state", {
        deviceId: device.id,
        status: device.status,
      });
      return null;
    }

    return {
      deviceId: device.id,
      deviceToken,
      screenId: device.screenId,
    };
  } catch (err) {
    log.warn("Backend unreachable, using fallback auth", {
      error: String(err),
    });
    return fallbackAuth(deviceToken);
  }
}

/**
 * Fallback auth for development when backend query isn't available yet.
 * Accepts any non-empty token and derives a pseudo screen ID.
 * This will be removed once the backend exposes digitalSignageDeviceByToken.
 */
function fallbackAuth(deviceToken: string): AuthResult {
  log.debug("Using fallback auth for device", {
    token: deviceToken.slice(0, 8) + "...",
  });
  return {
    deviceId: `dev-device-${deviceToken.slice(0, 8)}`,
    deviceToken,
    screenId: `dev-screen-${deviceToken.slice(0, 8)}`,
  };
}

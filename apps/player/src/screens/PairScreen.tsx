/**
 * PairScreen — device pairing UI.
 *
 * 1. User generates a 6-digit pairing code from the dashboard
 * 2. On this screen, enter the code
 * 3. Call PairDigitalSignageDevice mutation → get a device token
 * 4. Store token in localStorage, redirect to /display
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { config, deviceStorage } from "../lib/config";

export function PairScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [deviceName, setDeviceName] = useState("Living Room Display");
  const [status, setStatus] = useState<"idle" | "pairing" | "error">("idle");
  const [error, setError] = useState("");

  const handlePair = useCallback(async () => {
    if (code.length !== 6) {
      setError("Please enter a 6-digit pairing code");
      return;
    }

    setStatus("pairing");
    setError("");

    // Generate a unique device token for this device
    const deviceToken = crypto.randomUUID();

    try {
      const response = await fetch(
        `${config.backendUrl}${config.graphqlPath}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation PairDevice($input: PairDigitalSignageDeviceInput!) {
                pairDigitalSignageDevice(input: { input: $input }) {
                  digitalSignageDevice {
                    id
                    screenId
                    status
                  }
                }
              }
            `,
            variables: {
              input: {
                pairingCode: code,
                deviceToken,
                deviceName,
                type: "OTHER",
              },
            },
          }),
        }
      );

      const json = await response.json();

      if (json.errors?.length) {
        setError(json.errors[0].message);
        setStatus("error");
        return;
      }

      const device = json.data?.pairDigitalSignageDevice?.digitalSignageDevice;
      if (!device) {
        setError("Unexpected response from server");
        setStatus("error");
        return;
      }

      // Store credentials
      deviceStorage.setToken(deviceToken);
      deviceStorage.setScreenId(device.screenId);

      // Navigate to display
      navigate("/display", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }, [code, deviceName, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Elaview Player</h1>
        <p style={styles.subtitle}>Enter the pairing code from your dashboard</p>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          style={styles.codeInput}
          autoFocus
        />

        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="Device name"
          style={styles.nameInput}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handlePair}
          disabled={status === "pairing" || code.length !== 6}
          style={{
            ...styles.button,
            opacity: status === "pairing" || code.length !== 6 ? 0.5 : 1,
          }}
        >
          {status === "pairing" ? "Pairing..." : "Pair Device"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px",
    background: "#1a1a1a",
    borderRadius: "16px",
    maxWidth: "400px",
    width: "90%",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "8px",
    textAlign: "center" as const,
  },
  codeInput: {
    fontSize: "36px",
    fontFamily: "monospace",
    textAlign: "center" as const,
    letterSpacing: "8px",
    width: "100%",
    padding: "16px",
    background: "#111",
    border: "2px solid #333",
    borderRadius: "8px",
    color: "#fff",
    outline: "none",
  },
  nameInput: {
    fontSize: "16px",
    width: "100%",
    padding: "12px",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    outline: "none",
  },
  error: {
    color: "#ef4444",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 600,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

import path from "node:path";

export const e2eMarker = "e2e";

export const e2eDomain = "test.elaview.local";

export const e2eDefaultPassword = "E2eTest!234";

export const authCookieName = "elaview.authentication.token";

export const apiUrl = process.env.API_URL ?? "http://localhost:7106/api";

export const graphqlUrl = `${apiUrl}/graphql`;

export const cleanupRegistryPath = path.resolve(
  __dirname,
  "../results/.cleanup-registry.jsonl"
);

export const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

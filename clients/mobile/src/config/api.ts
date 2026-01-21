/**
 * API Configuration
 *
 * Provides configured API endpoints and utilities for making requests.
 * Uses environment variables from devbox/Doppler.
 */

import Constants from "expo-constants";
import { API_URL, GRAPHQL_ENDPOINT } from "./env";

const BACKEND_PORT = 7106;

function getDevApiUrl(): string {
  if (!__DEV__) {
    return API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:${BACKEND_PORT}`;
  }

  return API_URL;
}

export const baseUrl = getDevApiUrl();

export const graphqlUrl = __DEV__ ? `${baseUrl}/api/graphql` : GRAPHQL_ENDPOINT;

export const graphqlWsUrl = graphqlUrl.replace(/^http/, "ws");

/**
 * REST API endpoints
 */
export const endpoints = {
  auth: {
    login: `${baseUrl}/api/auth/login`,
    signup: `${baseUrl}/api/auth/signup`,
    logout: `${baseUrl}/api/auth/logout`,
  },
  // Add other REST endpoints as needed
} as const;

/**
 * Default fetch options for API requests
 * Includes credentials to send/receive cookies for authentication
 */
export const defaultFetchOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

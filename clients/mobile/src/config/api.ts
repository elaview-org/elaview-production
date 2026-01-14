/**
 * API Configuration
 *
 * Provides configured API endpoints and utilities for making requests.
 * Uses environment variables from devbox/Doppler.
 */

import { API_URL, GRAPHQL_ENDPOINT } from './env';

/**
 * Base API URL for REST endpoints
 * Example: http://localhost:7106 (development)
 */
export const baseUrl = API_URL;

/**
 * GraphQL endpoint
 * Example: http://localhost:7106/api/graphql (development)
 */
export const graphqlUrl = GRAPHQL_ENDPOINT;

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
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

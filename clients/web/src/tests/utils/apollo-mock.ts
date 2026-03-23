/**
 * Apollo Client mocking utilities for tests.
 * Provides helpers for creating mock responses and caches.
 * 
 * Note: Full Apollo mocking requires @apollo/client/testing package installation.
 * For now, these utilities provide basic helpers for test data structure.
 */

export function createMockApolloCache() {
  // Cache API is available from @apollo/client
  // This can be implemented when full Apollo testing is set up
  return null;
}

/**
 * Helper to create mock GraphQL query/mutation data structure
 * This provides type safety without requiring the full testing package
 */
export function createMockGraphQLResponse<T extends Record<string, unknown>>({
  data,
}: {
  data: T;
}) {
  return data;
}

/**
 * Helper to create a mock error response
 */
export function createMockErrorResponse({
  error,
}: {
  error: string | Error;
}) {
  return {
    error: error instanceof Error ? error.message : error,
  };
}


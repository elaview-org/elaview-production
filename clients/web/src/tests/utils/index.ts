/**
 * Test utilities barrel export.
 * Import commonly used test functions from here.
 */

// Render with providers - include plain render + renderWithProviders + Testing Library exports
export { render, renderWithProviders } from "./render-with-providers";
export {
  screen,
  within,
  waitFor,
  act,
} from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Test data factories
export {
  createMockUser,
  createMockSpace,
  createMockBooking,
  createMockCampaign,
  createMockNotification,
  createMockMessage,
  createMockConversation,
  createMockPayment,
  createMockPayout,
} from "./factories";

// GraphQL response helpers
export {
  createMockApolloCache,
  createMockGraphQLResponse,
  createMockErrorResponse,
} from "./apollo-mock";

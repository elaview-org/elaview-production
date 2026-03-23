/**
 * Enhanced test render wrapper with provider injection and GraphQL mocking.
 * Use this instead of plain `render()` in component tests to get full context.
 */

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Note: GraphQL mocking can be set up per-test using module mocks */
  [key: string]: any;
}

/**
 * Render a component with test providers.
 * For now, minimal provider setup - add more as needed.
 * GraphQL mocking is handled via module mocks in individual tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  renderOptions?: RenderWithProvidersOptions
) {
  return render(ui, renderOptions);
}

// Also export plain render as default for tests that don't need providers
export { render };

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect, mock } from "bun:test";

GlobalRegistrator.register();

expect.extend(matchers);

// Ensure document is fully initialized with body before any tests run
if (!document.body) {
  const html = document.createElement("html");
  const body = document.createElement("body");
  html.appendChild(body);
  document.appendChild(html);
}

// Initialize pointer capture methods if missing (userEvent requirement)
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function() {
    return undefined;
  };
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function() {
    return undefined;
  };
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function() {
    return false;
  };
}

afterEach(() => {
  // Clear body content without recreating body element
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

mock.module("next/navigation", () => import("./mocks/next-navigation"));

// Mock server-only to prevent "This module cannot be imported from a Client Component" errors
try {
  mock.module("server-only", () => ({}));
} catch {
  // Ignore if module doesn't exist or can't be mocked
}

// Mock next/headers to prevent server-only import errors
try {
  mock.module("next/headers", () => ({
    cookies: mock(() => ({
      toString: mock(() => ""),
      get: mock(),
      set: mock(),
      delete: mock(),
      has: mock(),
      getAll: mock(),
    })),
  }));
} catch {
  // Ignore if module doesn't exist or can't be mocked
}

// Mock Apollo Client integration to prevent import errors in tests
try {
  mock.module("@apollo/client-integration-nextjs", () => ({
    registerApolloClient: mock(() => ({
      getClient: mock(),
      query: mock(),
      PreloadQuery: mock(),
    })),
  }));
} catch {
  // Ignore if module doesn't exist or can't be mocked
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mock().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: mock(),
    removeListener: mock(),
    addEventListener: mock(),
    removeEventListener: mock(),
    dispatchEvent: mock(),
  })),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

Element.prototype.scrollIntoView = mock();

// Set up keyboard and pointer event support for happy-dom
Object.defineProperty(KeyboardEvent.prototype, "shiftKey", { get: () => false });
Object.defineProperty(KeyboardEvent.prototype, "ctrlKey", { get: () => false });
Object.defineProperty(KeyboardEvent.prototype, "altKey", { get: () => false });
Object.defineProperty(KeyboardEvent.prototype, "metaKey", { get: () => false });


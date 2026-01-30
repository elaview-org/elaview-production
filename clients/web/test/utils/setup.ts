import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect, mock } from "bun:test";

GlobalRegistrator.register();

expect.extend(matchers);

afterEach(() => {
  document.body.innerHTML = "";
});

mock.module("next/navigation", () => import("./mocks/next-navigation"));

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
Element.prototype.hasPointerCapture =
  mock() as unknown as typeof Element.prototype.hasPointerCapture;
Element.prototype.setPointerCapture = mock();
Element.prototype.releasePointerCapture = mock();

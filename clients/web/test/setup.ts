import "@testing-library/jest-dom/vitest";

vi.mock("next/navigation", () => import("./mocks/next-navigation"));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

Element.prototype.scrollIntoView = vi.fn();
Element.prototype.hasPointerCapture =
  vi.fn() as unknown as typeof Element.prototype.hasPointerCapture;
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();

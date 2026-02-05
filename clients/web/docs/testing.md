# Testing

Bun test + Testing Library + happy-dom.

## Quick Start

```bash
bun test              # Run all tests
bun test --watch      # Watch mode
bun test --coverage   # Coverage report
```

Or via the `ev` CLI:

```bash
ev web:test
ev web:coverage
```

### Writing a first test

Create `src/lib/utils.test.ts`:

```ts
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
```

Run it:

```bash
bun test src/lib/utils.test.ts
```

---

## Architecture

| Layer       | Tool                        | Purpose                              |
|-------------|-----------------------------|--------------------------------------|
| Runner      | bun test                    | Test execution, mocking, assertions  |
| DOM         | happy-dom                   | Browser-like environment             |
| Rendering   | @testing-library/react      | Component render + queries           |
| Matchers    | @testing-library/jest-dom   | DOM assertions (`toBeInTheDocument`) |
| Interaction | @testing-library/user-event | Realistic user events                |

### Directory structure

```
# Co-located unit tests (next to source)
src/lib/utils.test.ts
src/lib/hooks/use-mobile.test.ts
src/components/composed/toolbar/sort-panel.test.tsx

# Centralized test infrastructure + non-unit tests
src/tests/
├── utils/
│   ├── index.tsx              # Custom render, re-exports (screen, userEvent, asMock)
│   ├── setup.ts               # Preload: jest-dom matchers, happy-dom, browser mocks
│   ├── jest-dom.d.ts          # Type augmentation for jest-dom matchers in bun:test
│   └── mocks/
│       └── next-navigation.ts # next/navigation mock
├── issues/                    # Issue-driven regression tests
│   ├── parallel-routes.test.tsx
│   ├── sort-filter-reset.test.tsx
│   └── sort-duplicate-field.test.tsx
├── integration/               # Integration tests (multi-component flows)
└── snapshots/                 # Snapshot tests for composed components
```

**Where each test type lives:**
- **Unit tests**: co-located with source (`*.test.ts` next to `*.ts`)
- **Issue regression tests**: `src/tests/issues/` — one file per bug/issue
- **Integration tests**: `src/tests/integration/` — multi-component or cross-module
- **Snapshot tests**: `src/tests/snapshots/` — UI snapshot comparisons

### Configuration

`bunfig.toml` configures the test runner:

```toml
[test]
preload = ["./src/tests/utils/setup.ts"]

[test.coverage]
skipTestFiles = true
```

Bun test auto-discovers `*.test.{ts,tsx}` files. No include/exclude config needed — `node_modules` is excluded by default.

---

## Development Methodology

### Test-Driven Development (TDD) for New Features

1. Write failing tests that describe expected behavior
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

### Issue-Driven Development for Bugs

1. Reproduce the bug with a failing test in `src/tests/issues/`
2. Fix the code to make the test pass
3. Test stays as a permanent regression guard

Both approaches are mandatory. No new feature or bug fix lands without tests first.

---

## Test Types

### Unit tests

Pure functions, no DOM needed. Co-locate with source.

```ts
import { formatCurrency } from "@/lib/utils";

it("formats USD", () => {
  expect(formatCurrency(1234.5)).toBe("$1,234.50");
});
```

### Hook tests

```tsx
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

it("persists value", () => {
  const { result } = renderHook(() => useLocalStorage("key", "default"));
  act(() => result.current[1]("updated"));
  expect(result.current[0]).toBe("updated");
});
```

### Component tests

```tsx
import { render, screen, userEvent } from "@/tests/utils";
import MyComponent from "./my-component";

it("handles click", async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  await user.click(screen.getByRole("button"));
  expect(screen.getByText("Clicked")).toBeInTheDocument();
});
```

---

## Mocking

### Module mocking

Use `mock.module()` (bun:test global) to mock entire modules:

```tsx
mock.module("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({
    get: mock(),
    update: mock(),
  }),
}));
```

`mock.module()` is NOT hoisted like vitest's `vi.mock()`. However, at the top level of a test file, bun processes it before resolving static imports.

### Function mocking

```tsx
const mockFn = mock();
const typedMock = mock((_key: string): string | null => null);

mockFn.mockClear();
mockFn.mockReturnValue("value");
mockFn.mockImplementation(() => "custom");
```

### Asserting mock calls

```tsx
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith("arg");
```

### Spy on methods

```tsx
import { spyOn } from "bun:test";

const spy = spyOn(object, "method");
spy.mockReturnValue("mocked");
```

### asMock helper

For functions mocked via `mock.module()` in setup (e.g., `next/navigation`), use `asMock` to access mock methods:

```tsx
import { asMock } from "@/tests/utils";
import { useRouter } from "next/navigation";

it("navigates on submit", async () => {
  const push = mock();
  asMock(useRouter).mockReturnValue({ ...useRouter(), push });

  // ... trigger navigation ...
  expect(push).toHaveBeenCalledWith("/dashboard");
});
```

### next/navigation

Auto-mocked globally via `src/tests/utils/setup.ts`. Override per-test with `asMock`:

```tsx
import { asMock } from "@/tests/utils";
import { useSearchParams } from "next/navigation";

asMock(useSearchParams).mockReturnValue(new URLSearchParams({ page: "2" }));
```

Or use the custom render's `navigation` option:

```tsx
import { render } from "@/tests/utils";

render(<MyComponent />, {
  navigation: {
    searchParams: { page: "2" },
    pathname: "/bookings",
  },
});
```

### window.matchMedia

Auto-mocked globally. Returns `matches: false` by default.

### localStorage

happy-dom provides a working `localStorage`. For isolation, clear in `beforeEach`:

```tsx
beforeEach(() => localStorage.clear());
```

### What NOT to mock

- CSS / Tailwind classes (test behavior, not styling)
- Generated GraphQL types (import real enums from `@/types/gql`)
- React itself

---

## Patterns

### Arrange-Act-Assert

```tsx
it("disables submit when empty", async () => {
  render(<Form />);
  const button = screen.getByRole("button", { name: /submit/i });
  expect(button).toBeDisabled();
});
```

### Custom render

The `render` from `@/tests/utils` wraps Testing Library's render with navigation mock support. Always import from `@/tests/utils` instead of `@testing-library/react`.

### Testing toolbar components

Toolbar components (`sort-panel`, `filters-panel`) depend on `useSearchParamsUpdater`. Mock it and assert against `update`:

```tsx
const mockUpdate = mock();

mock.module("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({ get: mock(), update: mockUpdate }),
}));

it("applies sort", async () => {
  render(<ToolbarSortPanel sort={...} open={true} />);
  // interact...
  expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ sort: "field:ASC" }));
});
```

---

## What to Test / What to Skip

### Test

| Target | Type | Rationale |
|--------|------|-----------|
| `src/lib/utils.ts` | Unit | Pure functions, highest ROI |
| `src/lib/hooks/*` | Hook | Stateful logic, easy to test |
| `src/components/composed/toolbar/*` | Component | Complex interactions, business logic |
| `src/tests/issues/*` | Regression | Documents known issues, prevents regressions |

### Skip

| Target | Rationale |
|--------|-----------|
| `src/components/primitives/*` | Thin shadcn/ui wrappers, tested upstream |
| `src/types/gql/*` | Generated code |
| `src/lib/constants.ts`, `src/app/**/constants.ts` | Static data, no logic |
| `src/app/**/page.tsx` | Server components require full Next.js runtime |
| `src/app/**/loading.tsx`, `src/app/**/placeholder.tsx` | Skeleton UI, no logic |

---

## Coverage

```bash
bun test --coverage
```

Coverage configuration is in `bunfig.toml`:

```toml
[test.coverage]
skipTestFiles = true
```

---

## CI/CD

The `validate-web` workflow (`.github/workflows/validate-web.yaml`) runs on every PR:

1. `ev web:install` - Install dependencies
2. `ev web:lint` - ESLint
3. `ev web:typecheck` - TypeScript
4. `ev web:test` - bun test
5. `ev web:build` - Next.js build

All steps must pass for the PR to merge.

---

## Troubleshooting

### `ReferenceError: ResizeObserver is not defined`

Handled in `src/tests/utils/setup.ts`. If a new Radix component triggers this, verify the stub is loaded.

### `window.matchMedia is not a function`

Handled in `src/tests/utils/setup.ts`. Ensure tests import from `@/tests/utils` which loads the setup.

### Radix Select not opening in happy-dom

happy-dom doesn't fully implement pointer events. Radix Select may not open via `userEvent.click()`. Workarounds:

- Use `fireEvent.pointerDown` on the trigger
- Mock the Select component for unit tests
- Defer to E2E tests for complex Radix interactions

### `Cannot find module 'next/navigation'`

Ensure `src/tests/utils/setup.ts` includes the `mock.module("next/navigation", ...)` call. This is handled globally via preload.

### Tests hang or timeout

Check for unresolved promises or missing mock implementations. Radix portals can cause issues if `ResizeObserver` or `scrollIntoView` aren't mocked.

### TypeScript doesn't recognize jest-dom matchers

Ensure `src/tests/utils/jest-dom.d.ts` exists and is included in `tsconfig.json`. This file augments `bun:test`'s `Matchers` interface with jest-dom matchers.

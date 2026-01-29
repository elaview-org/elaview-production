# Testing

Vitest + Testing Library + jsdom.

## Quick Start

```bash
bun test              # Run all tests
bun test:watch        # Watch mode
bun test:coverage     # Coverage report → /coverage
```

Or via the `ev` CLI:

```bash
ev web:test
ev web:coverage
```

### Writing a first test

Create `lib/utils.test.ts`:

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
bun test lib/utils.test.ts
```

---

## Architecture

| Layer | Tool | Purpose |
|-------|------|---------|
| Runner | Vitest | Test execution, mocking, assertions |
| DOM | jsdom | Browser-like environment |
| Rendering | @testing-library/react | Component render + queries |
| Matchers | @testing-library/jest-dom | DOM assertions (`toBeInTheDocument`) |
| Interaction | @testing-library/user-event | Realistic user events |

### Directory structure

```
test/
├── setup.ts                    # Global setup (matchers, mocks)
├── utils.tsx                   # Custom render, re-exports
├── mocks/
│   └── next-navigation.ts      # next/navigation mock
└── issues/                     # Issue-driven regression tests
    ├── parallel-routes.test.tsx
    ├── sort-filter-reset.test.tsx
    └── sort-duplicate-field.test.tsx
```

Tests can also be co-located with their source files as `*.test.ts(x)`.

---

## Test Types

### Unit tests

Pure functions, no DOM needed.

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
import { render, screen, userEvent } from "@/test/utils";
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

### next/navigation

Auto-mocked globally via `test/setup.ts`. Override per-test:

```tsx
import { useRouter } from "next/navigation";

it("navigates on submit", async () => {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ ...useRouter(), push });

  // ... trigger navigation ...
  expect(push).toHaveBeenCalledWith("/dashboard");
});
```

Or use the custom render's `navigation` option:

```tsx
import { render } from "@/test/utils";

render(<MyComponent />, {
  navigation: {
    searchParams: { page: "2" },
    pathname: "/bookings",
  },
});
```

### window.matchMedia

Auto-mocked globally. Returns `matches: false` by default. Override for responsive tests:

```tsx
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === "(max-width: 768px)",
    // ...
  })),
});
```

### localStorage

jsdom provides a working `localStorage`. For isolation, clear in `beforeEach`:

```tsx
beforeEach(() => localStorage.clear());
```

### Apollo Client / GraphQL

Mock at the hook/module level rather than setting up a full Apollo provider:

```tsx
vi.mock("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({
    get: vi.fn(),
    update: vi.fn(),
  }),
}));
```

For server component data, mock the query results directly.

### What NOT to mock

- CSS / Tailwind classes (test behavior, not styling)
- Generated GraphQL types (import real enums from `@/types/gql`)
- React itself

---

## Patterns

### Arrange-Act-Assert

```tsx
it("disables submit when empty", async () => {
  // Arrange
  render(<Form />);

  // Act
  const button = screen.getByRole("button", { name: /submit/i });

  // Assert
  expect(button).toBeDisabled();
});
```

### Custom render

The `render` from `@/test/utils` wraps Testing Library's render with navigation mock support. Always import from `@/test/utils` instead of `@testing-library/react`.

### Testing toolbar components

Toolbar components (`sort-panel`, `filters-panel`) depend on `useSearchParamsUpdater`. Mock it and assert against `update`:

```tsx
const mockUpdate = vi.fn();
vi.mock("@/hooks/use-search-params-updater", () => ({
  useSearchParamsUpdater: () => ({ get: vi.fn(), update: mockUpdate }),
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
| `lib/utils.ts` | Unit | Pure functions, highest ROI |
| `hooks/*` | Hook | Stateful logic, easy to test |
| `components/composed/toolbar/*` | Component | Complex interactions, business logic |
| `test/issues/*` | Regression | Documents known issues, prevents regressions |

### Skip

| Target | Rationale |
|--------|-----------|
| `components/primitives/*` | Thin shadcn/ui wrappers, tested upstream |
| `types/gql/*` | Generated code |
| `lib/constants.ts`, `app/**/constants.ts` | Static data, no logic |
| `app/**/page.tsx` | Server components require full Next.js runtime |
| `app/**/loading.tsx`, `app/**/placeholder.tsx` | Skeleton UI, no logic |

---

## Coverage

Run locally:

```bash
bun test:coverage
```

Reports output to `/coverage` (gitignored). Open `coverage/index.html` for the HTML report.

Coverage excludes primitives, generated types, loading/placeholder skeletons, and static constants (configured in `vitest.config.ts`).

---

## CI/CD

The `validate-web` workflow (`.github/workflows/validate-web.yaml`) runs on every PR:

1. `ev web:install` - Install dependencies
2. `ev web:lint` - ESLint
3. `ev web:typecheck` - TypeScript
4. `ev web:test` - Vitest
5. `ev web:build` - Next.js build

All steps must pass for the PR to merge.

---

## TDD Workflow

Issue-driven tests in `test/issues/` follow TDD:

1. **Write a failing test** that documents the expected behavior
2. **Fix the code** to make the test pass
3. **Verify** the test passes and no regressions are introduced

Current issue tests:

- `parallel-routes.test.tsx` - Verifies `RoleBasedView` slot selection (passes)
- `sort-filter-reset.test.tsx` - Reset/Clear should not commit to URL (fails until fixed)
- `sort-duplicate-field.test.tsx` - Secondary sort should exclude primary field (fails until fixed)

---

## Troubleshooting

### `ReferenceError: ResizeObserver is not defined`

Already handled in `test/setup.ts`. If a new Radix component triggers this, verify the stub is loaded.

### `window.matchMedia is not a function`

Already handled in `test/setup.ts`. Ensure tests import from `@/test/utils` which loads the setup.

### Radix Select not opening in jsdom

jsdom doesn't fully implement pointer events. Radix Select may not open via `userEvent.click()`. Workarounds:

- Use `fireEvent.pointerDown` on the trigger
- Mock the Select component for unit tests
- Defer to E2E tests for complex Radix interactions

### `Cannot find module 'next/navigation'`

Ensure `test/setup.ts` includes the `vi.mock("next/navigation", ...)` call. This is handled globally.

### Tests hang or timeout

Check for unresolved promises or missing mock implementations. Radix portals can cause issues if `ResizeObserver` or `scrollIntoView` aren't mocked.

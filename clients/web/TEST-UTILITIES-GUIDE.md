# Test Infrastructure Quick Reference

## Running Tests

```bash
# Run all unit tests
bun test

# Run specific test file
bun test src/tests/example-infrastructure.test.ts

# Watch mode
bun test --watch

# With coverage (if configured)
bun test --coverage
```

## Importing Test Utilities

All test utilities are available from a single barrel export:

```typescript
import {
  // Rendering
  render,
  renderWithProviders,
  screen,
  within,
  waitFor,
  act,
  
  // User interaction
  userEvent,
  
  // Test data factories
  createMockUser,
  createMockSpace,
  createMockBooking,
  createMockCampaign,
  createMockNotification,
  createMockMessage,
  createMockConversation,
  createMockPayment,
  createMockPayout,
  
  // GraphQL helpers
  createMockGraphQLResponse,
  createMockErrorResponse,
} from "@/tests/utils";
```

## Test Data Factories

### Basic Usage

All factories create objects with realistic default values:

```typescript
const user = createMockUser();
const space = createMockSpace();
const booking = createMockBooking();
```

### With Partial Overrides

Customize specific fields while keeping other defaults:

```typescript
const admin = createMockUser({
  role: "ADMIN",
  name: "Administrator",
});

const inactiveSpace = createMockSpace({
  status: "INACTIVE",
  title: "Closed Location",
});

const futureBooking = createMockBooking({
  status: "PENDING_APPROVAL",
  startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
});
```

### Available Factories

```typescript
createMockUser(overrides?)           // → User with profile type
createMockSpace(overrides?)          // → Space with owner profile
createMockBooking(overrides?)        // → Booking with calculated amounts
createMockCampaign(overrides?)       // → Campaign with advertiser profile
createMockNotification(overrides?)   // → Notification with type
createMockMessage(overrides?)        // → Message in conversation
createMockConversation(overrides?)   // → Conversation with booking
createMockPayment(overrides?)        // → Payment with Stripe refs
createMockPayout(overrides?)         // → Payout with space owner profile
```

## Writing Component Tests

### Simple Component Test

```typescript
import { describe, it, expect } from "bun:test";
import { render, screen, createMockUser } from "@/tests/utils";
import UserCard from "@/components/user-card";

describe("UserCard", () => {
  it("displays user information", () => {
    const user = createMockUser({
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
    });
    
    render(<UserCard user={user} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/avatar.jpg"
    );
  });
});
```

### Test with Multiple Mock Objects

```typescript
describe("SpaceBookingForm", () => {
  it("submits booking data", () => {
    const space = createMockSpace({
      title: "Downtown Storefront",
      pricePerDay: 500,
    });
    const advertiser = createMockUser({
      activeProfileType: "ADVERTISER",
    });
    
    render(
      <SpaceBookingForm space={space} user={advertiser} />
    );
    
    const submitBtn = screen.getByRole("button", { name: /book now/i });
    expect(submitBtn).toBeInTheDocument();
  });
});
```

### Test with renderWithProviders

```typescript
// For components that need providers (if they exist)
describe("AdminDashboard", () => {
  it("shows admin panel", () => {
    renderWithProviders(<AdminDashboard />, {
      // Optional: Add mocked context values here
    });
    
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
});
```

## Testing Server Actions

```typescript
import { describe, it, expect, mock } from "bun:test";

describe("createCareerAction", () => {
  it("submits career form via GraphQL", async () => {
    // Mock the GraphQL API
    mock.module("@/api/server/careers", () => ({
      careers: {
        create: mock().mockResolvedValue({
          id: "career-1",
          title: "Senior Engineer",
        }),
      },
    }));
    
    const formData = new FormData();
    formData.set("title", "Senior Engineer");
    formData.set("department", "ENGINEERING");
    
    const result = await createCareerAction(formData);
    
    expect(result.data?.createCareer?.career?.id).toBe("career-1");
  });
});
```

## Common Test Patterns

### Test Loading State

```typescript
it("shows loading spinner while fetching", () => {
  render(<SpaceList isLoading={true} />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});
```

### Test Error State

```typescript
it("displays error message on failure", () => {
  const error = createMockErrorResponse({
    error: "Failed to load spaces",
  });
  
  render(<SpaceList error={error.error} />);
  expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
});
```

### Test with List Data

```typescript
it("renders booking list", () => {
  const bookings = [
    createMockBooking({ status: "APPROVED" }),
    createMockBooking({ status: "COMPLETED" }),
    createMockBooking({ status: "PENDING_APPROVAL" }),
  ];
  
  render(<BookingList bookings={bookings} />);
  
  expect(screen.getAllByRole("row")).toHaveLength(3);
});
```

## Best Practices

✅ **Do:**
- Use factories to create test data consistently
- Use partial overrides for test-specific customization
- Import all utilities from `@/tests/utils`
- Group related tests with `describe()`
- Use meaningful test names (describe + it)

❌ **Don't:**
- Hardcode test data instead of using factories
- Create deeply nested objects manually
- Use `userEvent.setup()` (use Playwright for interaction tests)
- Import directly from `factories.ts` - use barrel export instead
- Mock external dependencies in every test

## Debugging Tests

### View DOM Output

```typescript
import { render, screen } from "@/tests/utils";
import { debug } from "@testing-library/react";

render(<MyComponent />);
debug(screen.getByRole("main")); // Prints DOM to console
```

### Check What's Rendered

```typescript
// Find elements by role
screen.getByRole("button", { name: /submit/i });
screen.getAllByRole("row");

// Find by text
screen.getByText(/welcome/i);

// Find by label
screen.getByLabelText(/email/i);
```

## Running E2E Tests

Separate from unit tests - use Playwright:

```bash
# Run Playwright E2E tests
bun exec playwright test

# Run specific E2E test
bun exec playwright test seats.e2e.ts

# Debug mode
bun exec playwright test --debug
```

## Resources

- **Test Factories:** `src/tests/utils/factories.ts`
- **Render Wrapper:** `src/tests/utils/render-with-providers.tsx`
- **Test Setup:** `src/tests/utils/setup.ts`
- **Example Tests:** `src/tests/example-infrastructure.test.ts`
- **GraphQL Types:** `src/types/gql/graphql.ts`

## TypeScript Support

All factories are fully typed with TypeScript:

```typescript
// TypeScript knows space.pricePerDay is a number
const space = createMockSpace();
const daily = space.pricePerDay + 100; // ✅ Type safe

// Partial overrides maintain type safety
const updated = createMockSpace({
  pricePerDay: 500, // ✅ Must be number type
  // invalidField: "test", // ❌ TypeScript error
});
```

---

For more details, see `PHASE-1-TEST-INFRASTRUCTURE-COMPLETE.md`

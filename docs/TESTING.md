# Elaview Testing

> Testing strategy, patterns, and best practices for the Elaview codebase.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Commands](#commands)
- [File Structure](#file-structure)
- [Writing Good Tests](#writing-good-tests)
- [Test Factories](#test-factories)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Coverage Requirements](#coverage-requirements)
- [CI Integration](#ci-integration)
- [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Tests are documentation** | Tests show how code should be used |
| **Tests enable refactoring** | Change implementation safely |
| **Tests are required** | No PR approval without tests |
| **Flaky tests are bugs** | Fix immediately or delete |

### What to Test

```
✅ DO TEST:
- Business logic (fee calculations, status transitions)
- User interactions (taps, form submissions)
- Edge cases (empty states, error states)
- Accessibility (labels, roles)

❌ DON'T TEST:
- Third-party libraries (Apollo, Expo)
- Static content (hardcoded text)
- Implementation details (internal state)
- Styles (unless behavior-affecting)
```

---

## Test Types

| Type | Tool | Purpose | Runs On | Speed |
|------|------|---------|---------|-------|
| **Unit** | Jest | Pure functions, utils, helpers | Every PR | Fast |
| **Component** | React Native Testing Library | UI components in isolation | Every PR | Fast |
| **Hook** | @testing-library/react-hooks | Custom hooks | Every PR | Fast |
| **Integration** | Jest + MSW | Feature flows with mocked API | Every PR | Medium |
| **E2E (Mobile)** | Maestro | Critical user paths | Merge to develop | Slow |
| **E2E (Web)** | Playwright | Critical user paths | Merge to develop | Slow |

### Test Pyramid

```
        ┌───────────┐
        │    E2E    │  ← Few, critical paths only
        ├───────────┤
        │Integration│  ← Feature flows
        ├───────────┤
        │ Component │  ← UI behavior
        ├───────────┤
        │   Unit    │  ← Pure logic
        └───────────┘
           Many ↑
```

---

## Commands

### Basic Commands

```bash
# All unit + component tests
pnpm test

# Watch mode during development
pnpm test:watch

# Single file
pnpm test BookingCard

# Single test by name
pnpm test -t "calculates fee correctly"

# With coverage report
pnpm test:coverage

# Update snapshots
pnpm test -u
```

### Specialized Commands

```bash
# Integration tests only
pnpm test:integration

# E2E tests (requires running app)
pnpm test:e2e

# E2E smoke tests (subset for production)
pnpm test:e2e:smoke

# Run tests for changed files only
pnpm test --changedSince=origin/develop

# Debug mode (inspect)
pnpm test:debug BookingCard
```

### Per-Package Commands

```bash
# Mobile app tests
cd apps/mobile && pnpm test

# Web app tests
cd apps/web && pnpm test

# Shared package tests
cd packages/shared && pnpm test

# Features package tests
cd packages/features && pnpm test
```

---

## File Structure

### Co-located Tests

Tests live next to the code they test:

```
packages/features/bookings/
├── components/
│   ├── BookingCard.tsx
│   └── BookingCard.test.tsx       # Component test
├── hooks/
│   ├── useBooking.ts
│   └── useBooking.test.ts         # Hook test
└── utils/
    ├── calculateFee.ts
    └── calculateFee.test.ts       # Unit test
```

### Shared Testing Utilities

```
packages/shared/testing/
├── factories/                      # Test data factories
│   ├── user.factory.ts
│   ├── booking.factory.ts
│   ├── space.factory.ts
│   ├── spaceCategory.factory.ts
│   ├── spaceType.factory.ts
│   └── index.ts
├── mocks/
│   ├── handlers.ts                # MSW GraphQL handlers
│   ├── server.ts                  # MSW server setup
│   └── apollo.tsx                 # Mock Apollo Provider
└── utils/
    ├── render.tsx                 # Custom render with providers
    ├── waitFor.ts                 # Custom wait utilities
    └── testIds.ts                 # Shared test ID constants
```

### E2E Tests

```
apps/mobile/e2e/
├── flows/
│   ├── advertiser-booking.yaml    # Maestro flow
│   ├── owner-verification.yaml
│   ├── owner-onboarding.yaml
│   └── smoke.yaml                 # Quick smoke tests
├── helpers/
│   ├── auth-advertiser.yaml       # Reusable auth steps
│   ├── auth-owner.yaml
│   └── navigation.yaml
└── maestro.config.yaml

apps/web/e2e/
├── tests/
│   ├── dashboard.spec.ts          # Playwright test
│   ├── onboarding.spec.ts
│   └── auth.spec.ts
├── fixtures/
│   └── auth.ts                    # Auth fixtures
└── playwright.config.ts
```

---

## Writing Good Tests

### Arrange-Act-Assert Pattern

```typescript
it('calculates fee correctly for PER_SQFT type', () => {
  // Arrange — set up test data
  const category = createMockSpaceCategory({ 
    feeCalculationType: 'PER_SQFT',
    basePrintInstallFee: 5,
  });
  const spaceType = createMockSpaceType({ category });
  
  // Act — perform the action
  const fee = calculatePrintInstallFee(spaceType, 100); // 100 sqft
  
  // Assert — verify the result
  expect(fee).toBe(500); // 5 × 100
});
```

### Test Behavior, Not Implementation

```typescript
// ❌ Bad — testing implementation details
it('sets isLoading to true', () => {
  const { result } = renderHook(() => useBooking('123'));
  expect(result.current.isLoading).toBe(true);
});

// ✅ Good — testing observable behavior
it('shows loading state while fetching', () => {
  render(<BookingDetails id="123" />);
  expect(screen.getByTestId('loading-spinner')).toBeOnTheScreen();
});
```

### Use Descriptive Test Names

```typescript
// ❌ Bad — unclear what's being tested
it('works correctly', () => { ... });
it('booking test', () => { ... });

// ✅ Good — describes behavior
it('displays error message when booking fails', () => { ... });
it('disables submit button while payment is processing', () => { ... });
it('navigates to confirmation when booking succeeds', () => { ... });
```

### One Assertion Per Concept

```typescript
// ❌ Bad — testing multiple unrelated things
it('booking card works', () => {
  render(<BookingCard booking={booking} />);
  expect(screen.getByText('Pending')).toBeOnTheScreen();
  expect(screen.getByText('$150')).toBeOnTheScreen();
  fireEvent.press(screen.getByTestId('card'));
  expect(onPress).toHaveBeenCalled();
});

// ✅ Good — focused tests
describe('BookingCard', () => {
  it('displays booking status', () => {
    render(<BookingCard booking={booking} />);
    expect(screen.getByText('Pending')).toBeOnTheScreen();
  });

  it('displays price', () => {
    render(<BookingCard booking={booking} />);
    expect(screen.getByText('$150')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', () => {
    render(<BookingCard booking={booking} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('booking-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Test Factories

### Creating Factories

```typescript
// packages/shared/testing/factories/booking.factory.ts

import { faker } from '@faker-js/faker';
import { Booking, BookingStatus } from '@elaview/types';
import { createMockSpace } from './space.factory';
import { createMockUser } from './user.factory';

export function createMockBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: faker.string.uuid(),
    status: BookingStatus.PENDING,
    advertiserId: faker.string.uuid(),
    advertiser: createMockUser({ role: 'ADVERTISER' }),
    spaceId: faker.string.uuid(),
    space: createMockSpace(),
    startDate: faker.date.future().toISOString(),
    endDate: faker.date.future({ years: 1 }).toISOString(),
    totalPrice: faker.number.int({ min: 100, max: 1000 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

// Convenience factories for specific states
export function createPendingBooking(overrides: Partial<Booking> = {}) {
  return createMockBooking({ status: BookingStatus.PENDING, ...overrides });
}

export function createPaidBooking(overrides: Partial<Booking> = {}) {
  return createMockBooking({ 
    status: BookingStatus.PAID,
    paidAt: faker.date.recent().toISOString(),
    ...overrides,
  });
}

export function createInstalledBooking(overrides: Partial<Booking> = {}) {
  return createMockBooking({
    status: BookingStatus.INSTALLED,
    installedAt: faker.date.recent().toISOString(),
    verificationPhotos: [
      { id: faker.string.uuid(), url: faker.image.url() },
    ],
    ...overrides,
  });
}
```

### Using Factories

```typescript
// ❌ Bad — meaningless data
const booking = { id: '123', status: 'test', price: 0 };

// ✅ Good — realistic data from factory
const booking = createMockBooking({ 
  status: BookingStatus.PAID,
  space: createMockSpace({ pricePerWeek: 150 }),
});

// ✅ Good — convenience factory for specific state
const booking = createPaidBooking();
```

### Factory Index

```typescript
// packages/shared/testing/factories/index.ts

export * from './user.factory';
export * from './booking.factory';
export * from './space.factory';
export * from './spaceCategory.factory';
export * from './spaceType.factory';
export * from './payment.factory';
export * from './payout.factory';
export * from './notification.factory';
```

---

## Component Testing

### Setup

```typescript
// packages/shared/testing/utils/render.tsx

import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MockedProvider } from '@apollo/client/testing';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface CustomRenderOptions extends RenderOptions {
  mocks?: any[];
  initialRoute?: string;
}

function AllProviders({ children, mocks = [] }: { children: React.ReactNode; mocks?: any[] }) {
  return (
    <SafeAreaProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </MockedProvider>
    </SafeAreaProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { mocks, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => <AllProviders mocks={mocks}>{children}</AllProviders>,
    ...renderOptions,
  });
}

export * from '@testing-library/react-native';
export { renderWithProviders as render };
```

### Component Test Example

```typescript
// packages/features/bookings/components/BookingCard.test.tsx

import { render, screen, fireEvent } from '@elaview/shared/testing';
import { BookingCard } from './BookingCard';
import { createMockBooking } from '@elaview/shared/testing/factories';

describe('BookingCard', () => {
  it('renders booking status correctly', () => {
    const booking = createMockBooking({ status: 'PAID' });
    
    render(<BookingCard booking={booking} />);
    
    expect(screen.getByText('Paid — awaiting install')).toBeOnTheScreen();
  });

  it('renders pending status with countdown', () => {
    const booking = createMockBooking({ 
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    });
    
    render(<BookingCard booking={booking} />);
    
    expect(screen.getByText(/expires in/i)).toBeOnTheScreen();
  });

  it('calls onPress when tapped', () => {
    const booking = createMockBooking();
    const onPress = jest.fn();
    
    render(<BookingCard booking={booking} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('booking-card'));
    
    expect(onPress).toHaveBeenCalledWith(booking.id);
  });

  it('shows action button for actionable statuses', () => {
    const booking = createMockBooking({ status: 'INSTALLED' });
    
    render(<BookingCard booking={booking} />);
    
    expect(screen.getByText('Review Installation')).toBeOnTheScreen();
  });

  it('hides action button for terminal statuses', () => {
    const booking = createMockBooking({ status: 'COMPLETED' });
    
    render(<BookingCard booking={booking} />);
    
    expect(screen.queryByTestId('action-button')).not.toBeOnTheScreen();
  });

  it('displays space image', () => {
    const booking = createMockBooking({
      space: createMockSpace({ 
        photos: [{ url: 'https://example.com/photo.jpg' }],
      }),
    });
    
    render(<BookingCard booking={booking} />);
    
    expect(screen.getByTestId('space-image')).toHaveProp(
      'source',
      expect.objectContaining({ uri: 'https://example.com/photo.jpg' })
    );
  });
});
```

### Testing Accessibility

```typescript
it('has accessible labels for screen readers', () => {
  const booking = createMockBooking({ 
    space: createMockSpace({ title: 'Coffee Shop Window' }),
    status: 'PAID',
  });
  
  render(<BookingCard booking={booking} />);
  
  expect(screen.getByRole('button')).toHaveAccessibleName(
    'Coffee Shop Window booking, status: Paid — awaiting install'
  );
});

it('announces status changes to screen reader', async () => {
  const { rerender } = render(
    <BookingCard booking={createMockBooking({ status: 'PENDING' })} />
  );
  
  rerender(
    <BookingCard booking={createMockBooking({ status: 'ACCEPTED' })} />
  );
  
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
    'Booking accepted'
  );
});
```

---

## Hook Testing

### Basic Hook Test

```typescript
// packages/features/bookings/hooks/useBooking.test.ts

import { renderHook, waitFor } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { useBooking } from './useBooking';
import { GET_BOOKING } from '../graphql/queries';
import { createMockBooking } from '@elaview/shared/testing/factories';

const mockBooking = createMockBooking({ id: 'booking-123' });

const mocks = [
  {
    request: {
      query: GET_BOOKING,
      variables: { id: 'booking-123' },
    },
    result: {
      data: { booking: mockBooking },
    },
  },
];

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
}

describe('useBooking', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useBooking('booking-123'), { wrapper });
    
    expect(result.current.loading).toBe(true);
    expect(result.current.booking).toBeUndefined();
  });

  it('returns booking data after loading', async () => {
    const { result } = renderHook(() => useBooking('booking-123'), { wrapper });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.booking).toEqual(mockBooking);
  });

  it('returns error when query fails', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_BOOKING,
          variables: { id: 'booking-123' },
        },
        error: new Error('Network error'),
      },
    ];
    
    const { result } = renderHook(() => useBooking('booking-123'), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMocks}>{children}</MockedProvider>
      ),
    });
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

### Testing Mutations

```typescript
// packages/features/bookings/hooks/useAcceptBooking.test.ts

import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { useAcceptBooking } from './useAcceptBooking';
import { ACCEPT_BOOKING } from '../graphql/mutations';

describe('useAcceptBooking', () => {
  it('updates booking status on success', async () => {
    const mocks = [
      {
        request: {
          query: ACCEPT_BOOKING,
          variables: { id: 'booking-123' },
        },
        result: {
          data: {
            acceptBooking: {
              id: 'booking-123',
              status: 'ACCEPTED',
            },
          },
        },
      },
    ];
    
    const { result } = renderHook(() => useAcceptBooking(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });
    
    act(() => {
      result.current.accept('booking-123');
    });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data?.acceptBooking.status).toBe('ACCEPTED');
  });
});
```

---

## Integration Testing

### MSW Setup

```typescript
// packages/shared/testing/mocks/handlers.ts

import { graphql, HttpResponse } from 'msw';
import { createMockBooking, createMockSpace } from '../factories';

export const handlers = [
  // Queries
  graphql.query('GetBookings', () => {
    return HttpResponse.json({
      data: {
        bookings: {
          edges: [
            { node: createMockBooking() },
            { node: createMockBooking() },
          ],
          pageInfo: { hasNextPage: false },
        },
      },
    });
  }),

  graphql.query('GetBooking', ({ variables }) => {
    return HttpResponse.json({
      data: {
        booking: createMockBooking({ id: variables.id }),
      },
    });
  }),

  // Mutations
  graphql.mutation('AcceptBooking', ({ variables }) => {
    return HttpResponse.json({
      data: {
        acceptBooking: createMockBooking({ 
          id: variables.id, 
          status: 'ACCEPTED',
        }),
      },
    });
  }),

  graphql.mutation('DeclineBooking', ({ variables }) => {
    return HttpResponse.json({
      data: {
        declineBooking: createMockBooking({ 
          id: variables.id, 
          status: 'DECLINED',
        }),
      },
    });
  }),
];
```

### Integration Test Example

```typescript
// packages/features/bookings/BookingFlow.integration.test.tsx

import { render, screen, fireEvent, waitFor } from '@elaview/shared/testing';
import { server } from '@elaview/shared/testing/mocks/server';
import { graphql, HttpResponse } from 'msw';
import { BookingFlow } from './BookingFlow';

describe('Booking Flow Integration', () => {
  it('completes full booking flow', async () => {
    // Override handler for this test
    server.use(
      graphql.mutation('CreateBooking', () => {
        return HttpResponse.json({
          data: {
            createBooking: createMockBooking({ status: 'PENDING' }),
          },
        });
      })
    );
    
    render(<BookingFlow spaceId="space-123" />);
    
    // Step 1: Select dates
    expect(screen.getByText('Select Dates')).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId('date-start'));
    fireEvent.press(screen.getByText('15'));
    fireEvent.press(screen.getByText('Confirm'));
    fireEvent.press(screen.getByText('Continue'));
    
    // Step 2: Upload creative
    await waitFor(() => {
      expect(screen.getByText('Upload Creative')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByTestId('upload-button'));
    // ... simulate file selection
    fireEvent.press(screen.getByText('Continue'));
    
    // Step 3: Review and submit
    await waitFor(() => {
      expect(screen.getByText('Review Booking')).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByText('Submit Request'));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Booking Submitted!')).toBeOnTheScreen();
    });
  });

  it('handles API error gracefully', async () => {
    server.use(
      graphql.mutation('CreateBooking', () => {
        return HttpResponse.json({
          errors: [{ message: 'Booking failed' }],
        });
      })
    );
    
    render(<BookingFlow spaceId="space-123" />);
    
    // ... navigate to submit
    fireEvent.press(screen.getByText('Submit Request'));
    
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
      expect(screen.getByText('Try Again')).toBeOnTheScreen();
    });
  });
});
```

---

## E2E Testing

### Maestro (Mobile)

#### Flow Example

```yaml
# apps/mobile/e2e/flows/advertiser-booking.yaml
appId: com.elaview.app
---
# Auth
- runFlow: ../helpers/auth-advertiser.yaml

# Navigate to discover
- tapOn: "Discover"
- assertVisible: "Find spaces near you"

# Select a space
- tapOn:
    id: "space-marker-0"
- assertVisible: "Space Details"

# Start booking
- tapOn: "Book This Space"
- assertVisible: "Select Dates"

# Select dates
- tapOn:
    id: "date-start"
- tapOn: "15"
- tapOn: "Confirm"
- tapOn:
    id: "date-end"
- tapOn: "22"
- tapOn: "Confirm"
- tapOn: "Continue"

# Upload creative
- assertVisible: "Upload Creative"
- tapOn:
    id: "upload-button"
- tapOn: "Choose from Library"
- tapOn:
    id: "photo-0"
- assertVisible: "Creative uploaded"
- tapOn: "Continue"

# Review and submit
- assertVisible: "Review Booking"
- assertVisible: "$"
- tapOn: "Submit Request"

# Confirmation
- assertVisible: "Booking Submitted!"
- assertVisible: "We'll notify you when the owner responds"
```

#### Helper Flows

```yaml
# apps/mobile/e2e/helpers/auth-advertiser.yaml
appId: com.elaview.app
---
- clearState
- launchApp

- tapOn: "Sign In"
- inputText:
    id: "email-input"
    text: "test-advertiser@elaview.com"
- inputText:
    id: "password-input"
    text: "TestPassword123!"
- tapOn: "Continue"

- assertVisible: "Home"
```

#### Smoke Tests

```yaml
# apps/mobile/e2e/flows/smoke.yaml
appId: com.elaview.app
---
# Quick critical path verification

# Auth smoke
- runFlow: ../helpers/auth-advertiser.yaml
- assertVisible: "Home"

# Navigation smoke
- tapOn: "Discover"
- assertVisible: "Find spaces"
- tapOn: "Bookings"
- assertVisible: "Your Bookings"
- tapOn: "Profile"
- assertVisible: "Settings"

# Logout
- tapOn: "Sign Out"
- assertVisible: "Sign In"
```

### Playwright (Web)

```typescript
// apps/web/e2e/tests/dashboard.spec.ts

import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';

test.describe('Space Owner Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'owner');
  });

  test('displays booking requests', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByRole('heading', { name: 'Pending Requests' })).toBeVisible();
    await expect(page.getByTestId('booking-card')).toHaveCount(2);
  });

  test('can accept a booking', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByTestId('booking-card').first().click();
    await expect(page.getByText('Booking Details')).toBeVisible();
    
    await page.getByRole('button', { name: 'Accept' }).click();
    
    await expect(page.getByText('Booking Accepted')).toBeVisible();
  });

  test('can view earnings', async ({ page }) => {
    await page.goto('/dashboard/earnings');
    
    await expect(page.getByRole('heading', { name: 'Earnings' })).toBeVisible();
    await expect(page.getByTestId('total-earnings')).toBeVisible();
    await expect(page.getByTestId('pending-payouts')).toBeVisible();
  });
});
```

---

## Coverage Requirements

### Minimum Coverage by Code Type

| Code Type | Min Coverage | Rationale |
|-----------|-------------|-----------|
| Utils/helpers | 100% | Pure functions, easy to test |
| Hooks | 90% | Core logic, affects UI |
| Components | 80% | UI behavior, user-facing |
| GraphQL operations | 70% | API integration |
| Screens | 60% | Covered by E2E |

### Critical Paths (E2E Required)

| Flow | Priority | Frequency |
|------|----------|-----------|
| User signup | P0 | Every deploy |
| User login | P0 | Every deploy |
| Create booking | P0 | Every deploy |
| Accept/decline booking | P0 | Every deploy |
| Upload verification | P0 | Every deploy |
| Payment flow | P0 | Every deploy |
| Space creation | P1 | Daily |
| Onboarding | P1 | Daily |

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/lcov-report/index.html

# Coverage by package
pnpm test:coverage --coverage-reporters=json-summary
```

---

## CI Integration

### Pipeline Stages

| Stage | Tests Run | Blocking? | Duration |
|-------|-----------|-----------|----------|
| PR opened | Unit, Component, Integration | Yes | ~3 min |
| PR updated | Unit, Component, Integration | Yes | ~3 min |
| Merge to develop | Full suite + E2E | Yes | ~15 min |
| Deploy to staging | E2E against staging | Yes | ~10 min |
| Deploy to production | Smoke tests | Yes | ~5 min |

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml

name: Test

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: macos-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
    needs: unit-tests
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
      
      - run: pnpm install
      - run: pnpm build:mobile
      
      - name: Install Maestro
        run: curl -Ls https://get.maestro.mobile.dev | bash
      
      - name: Run E2E tests
        run: maestro test apps/mobile/e2e/flows/
```

### PR Status Checks

```yaml
# Required checks for PR merge
required_status_checks:
  - unit-tests
  - lint
  - type-check
  - build
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Tests timeout | Increase timeout: `jest.setTimeout(10000)` |
| Mock not working | Check mock is defined before render |
| Async test fails | Use `waitFor` or `findBy*` queries |
| Navigation error | Wrap with `NavigationContainer` |
| Apollo error | Wrap with `MockedProvider` |

### Debugging Tips

```typescript
// Print component tree
screen.debug();

// Print specific element
screen.debug(screen.getByTestId('booking-card'));

// Log all queries
import { configure } from '@testing-library/react-native';
configure({ debug: { printLimit: Infinity } });

// Use debugger
it('debug test', async () => {
  render(<MyComponent />);
  debugger; // Will pause in Chrome DevTools
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

### Running Failed Tests

```bash
# Re-run only failed tests
pnpm test --onlyFailures

# Run with verbose output
pnpm test --verbose

# Run with no cache
pnpm test --no-cache
```

---

## Related Documentation

- [API Contracts](./API-CONTRACTS.md) - GraphQL operations to mock
- [Mobile Screens](./MOBILE-SCREENS.md) - Screen components to test
- [Booking Lifecycle](./BOOKING-LIFECYCLE.md) - Status transitions to test

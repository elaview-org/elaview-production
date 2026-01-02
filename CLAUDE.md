# Elaview - AI Development Context

> B2B advertising marketplace connecting local advertisers with physical ad space owners (storefronts, windows, walls).

## Quick Reference

**Stack:**
- Backend: .NET + GraphQL (HotChocolate) — Quang owns
- Mobile: Expo SDK 54 + React Native + Expo Router v6 — Mike owns
- Web: Next.js 15 + App Router — Quang maintains
- API: GraphQL via Apollo Client
- Payments: Stripe Connect (two-stage payout)
- Storage: Cloudflare R2
- Monorepo: Turborepo + pnpm

**Team:**
- @mike-anderson — Mobile app, frontend lead
- @quang-cap — Backend, web app, infrastructure

## Core Business Logic

### Two-Stage Payout Flow
1. Advertiser pays → Stripe holds in escrow
2. Owner downloads file → **Stage 1 payout** (print+install fee: $10-35)
3. Owner prints locally, installs, uploads verification photos
4. Advertiser approves (or auto-approves after 48hr) → **Stage 2 payout** (remainder)

### Booking Statuses
```
PENDING_APPROVAL → ACCEPTED → PAID → FILE_DOWNLOADED → INSTALLED → VERIFIED → COMPLETED
                                                              ↓
                                                         DISPUTED
```

### Space Types (DATABASE-DRIVEN — Never Hardcode!)
Space types come from SpaceCategory and SpaceType database entities. New categories (billboards, vehicles) can be added via admin panel without code changes.

## Project Structure

```
elaview/
├── apps/
│   ├── mobile/          # Expo React Native
│   └── web/             # Next.js 15
├── packages/
│   ├── features/        # Shared domain logic (bulletproof pattern)
│   │   ├── auth/
│   │   ├── spaces/
│   │   ├── bookings/
│   │   ├── payments/
│   │   └── verification/
│   ├── graphql/         # Generated types + operations
│   └── shared/          # Constants, validation, testing utilities
├── backend/             # .NET GraphQL API
├── .cursor/rules/       # AI context files (detailed)
├── .github/             # CI/CD workflows
└── docs/                # Architecture documentation
```

## Development Rules

### Always

✅ Use TypeScript strict mode
✅ Write tests alongside features (unit + component minimum)
✅ Read space type config from API, never hardcode
✅ Use factories for test data (createMockBooking, etc.)
✅ Follow git commit format: `type(scope): description`
✅ Include testID props for E2E testing

### Never

❌ Hardcode space types, fees, or verification requirements
❌ Skip tests for new features
❌ Commit console.log or debug code
❌ Push directly to main, staging, or develop
❌ Store secrets in code

## Context Files

For detailed context, see `.cursor/rules/`:

| File | Use When |
|------|----------|
| `02-domain-model.mdc` | Working with entities, types, schemas |
| `03-booking-lifecycle.mdc` | Booking status logic, state transitions |
| `04-payment-flow.mdc` | Stripe, payouts, escrow, refunds |
| `05-mobile-development.mdc` | Expo, React Native, navigation |
| `06-graphql-patterns.mdc` | Apollo, queries, mutations, codegen |
| `09-testing-strategy.mdc` | Writing tests, factories, E2E |

## Commands

```bash
# Development
pnpm dev                 # Start all apps
pnpm dev:mobile          # Start mobile only
pnpm dev:web             # Start web only

# Testing
pnpm test                # All unit + component tests
pnpm test:watch          # Watch mode
pnpm test:coverage       # With coverage
pnpm test:integration    # Integration tests
pnpm test:e2e            # E2E tests

# Code Quality
pnpm lint                # ESLint
pnpm typecheck           # TypeScript
pnpm format              # Prettier

# Build
pnpm build               # Build all packages
```

## Getting Help

- **Architecture questions:** See `docs/ARCHITECTURE.md`
- **API contracts:** See `docs/API-CONTRACTS.md`
- **Mobile screens:** See `docs/MOBILE-SCREENS.md`
- **Testing patterns:** See `docs/TESTING.md`
- **Adding space types:** See `docs/EXTENSIBILITY.md`

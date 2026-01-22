# Elaview - AI Development Context

> B2B advertising marketplace connecting local advertisers with physical ad space owners (storefronts, windows, walls).

**🚀 New to the project? Start here:** [START_HERE.md](./START_HERE.md)

## Quick Reference

**Stack:**
- Backend: .NET + GraphQL (HotChocolate) — Quang owns
- Mobile: Expo SDK 54 + React Native + Expo Router v6 — Mike owns
- Web: Next.js 15 + App Router — Quang maintains
- API: GraphQL via Apollo Client
- Payments: Stripe Connect (two-stage payout)
- Storage: Cloudflare R2
- Monorepo: Turborepo + bun

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
✅ **ALWAYS use bun, never npm, yarn, or pnpm**
✅ Write tests alongside features (unit + component minimum)
✅ Read space type config from API, never hardcode
✅ Use factories for test data (createMockBooking, etc.)
✅ Follow git commit format: `type(scope): description`
✅ Include testID props for E2E testing
✅ **Mobile:** Import config from `@/config` (never use process.env directly)

### Never

❌ **NEVER use npm, yarn, or pnpm - ONLY use bun**
❌ Hardcode space types, fees, or verification requirements
❌ Skip tests for new features
❌ Commit console.log or debug code
❌ Push directly to main, staging, or develop
❌ Store secrets in code
❌ **Mobile:** Never create .env files (use devbox/Doppler instead)

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
bun dev                 # Start all apps
bun dev:mobile          # Start mobile only
bun dev:web             # Start web only

# Testing
bun test                # All unit + component tests
bun test:watch          # Watch mode
bun test:coverage       # With coverage
bun test:integration    # Integration tests
bun test:e2e            # E2E tests

# Code Quality
bun lint                # ESLint
bun typecheck           # TypeScript
bun format              # Prettier

# Build
bun build               # Build all packages
```

## Environment Configuration

### Mobile App (clients/mobile)
- **Environment variables** are managed via Doppler and loaded through `devbox shell`
- **No .env files needed** - all config comes from `ELAVIEW_MOBILE_*` variables
- **Import from `@/config`** in your code:
  ```typescript
  import { API_URL, GRAPHQL_ENDPOINT, STRIPE_PUBLISHABLE_KEY } from '@/config';
  ```
- See `clients/mobile/src/config/README.md` for detailed usage
- See `clients/mobile/API-INTEGRATION-GUIDE.md` for API integration patterns

### Backend
- Uses Doppler with `ELAVIEW_BACKEND_*` prefix
- Loaded via devbox shell

## Getting Help

- **📍 Start here:** See `START_HERE.md` (comprehensive onboarding & documentation index)
- **Architecture questions:** See `docs/ARCHITECTURE.md`
- **API contracts:** See `docs/API-CONTRACTS.md`
- **Mobile screens:** See `docs/MOBILE-SCREENS.md`
- **Mobile API integration:** See `clients/mobile/API-INTEGRATION-GUIDE.md`
- **Mobile env config:** See `clients/mobile/src/config/README.md`
- **Testing patterns:** See `docs/TESTING.md`
- **Adding space types:** See `docs/EXTENSIBILITY.md`
- **Daily workflow:** See `docs/DAILY-WORKFLOW.md`

# START HERE - Elaview Developer Onboarding

> B2B advertising marketplace connecting local advertisers with physical ad space owners.
>
> **This is your entry point.** Everything else in the documentation is linked from here.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Map](#project-map)
- [Documentation Index](#documentation-index)
- [Tech Stack](#tech-stack)
- [Key Architectural Decisions](#key-architectural-decisions)
- [Common Commands](#common-commands)
- [Gotchas & Troubleshooting](#gotchas--troubleshooting)

---

## Quick Start

### Prerequisites

```bash
# Required
- Node.js 20+
- pnpm 9+
- Git
- Docker (for local PostgreSQL)

# Platform-specific for Mobile Development
- macOS:
  - Xcode 15+ (for iOS development)
  - CocoaPods 1.15.2+ (install: brew install cocoapods)
  - iOS Simulator
- Android Studio + Android Emulator (for Android)
- .NET 8 SDK (for backend development)
```

### Get Running in < 5 Minutes

#### 1. Clone & Install

```bash
git clone https://github.com/elaview-org/elaview-production.git
cd elaview-production
pnpm install

# iOS Development Only: Install CocoaPods dependencies
cd clients/mobile/ios
pod install
cd ../../..
```

#### 2. Environment Setup

```bash
# Copy environment templates
cp .env.example .env
cp clients/web/.env.example clients/web/.env.local
cp clients/mobile/.env.example clients/mobile/.env.local
```

**Minimum required variables:**
```env
# .env (root)
GRAPHQL_ENDPOINT=http://localhost:5000/graphql
STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Ask team for test key

# clients/mobile/.env.local
EXPO_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:5000/graphql
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

#### 3. Start Development

**Option A: Everything at once**
```bash
pnpm dev
```

**Option B: Individual platforms**

```bash
# Web only
pnpm dev:web
# → http://localhost:3000

# Mobile only
pnpm dev:mobile
# → Scan QR with Expo Go (Expo SDK <54) OR custom dev build (SDK 54+)

# Backend only (if working on .NET)
cd backend
dotnet run
# → http://localhost:5000/graphql
```

### First-Time Mobile Setup (IMPORTANT!)

**Elaview mobile app requires EAS development builds** (not Expo Go).

Why? Because we use:
- React Native New Architecture (`newArchEnabled: true`)
- React Native Reanimated 4.x (requires Babel plugin)
- Native dependencies not in Expo Go

**Setup EAS Build:**

```bash
# Install EAS CLI globally
pnpm add -g eas-cli

# Login to EAS
eas login

# Configure project (if not already configured)
cd clients/mobile
eas build:configure

# Build development client
# iOS (simulator - Mac only):
eas build --profile development --platform ios

# Android (emulator/device):
eas build --profile development --platform android

# First build takes ~15-20 minutes, subsequent builds are faster
```

**After build completes:**
- **iOS**: Download `.tar.gz`, drag to simulator
- **Android**: Download APK, install on device/emulator

**Start dev server:**
```bash
cd clients/mobile
npx expo start --dev-client
```

Scan QR with your **custom dev build** (not Expo Go).

See [Mobile Development Setup](#mobile-gotchas) for troubleshooting.

---

## Project Map

```
elaview/
│
├── backend/                    # .NET 8 GraphQL API (Quang owns)
│   ├── Data/                   # Entity Framework DbContext
│   ├── GraphQL/                # HotChocolate queries/mutations/types
│   ├── Models/                 # Entity models (User, Space, Booking, etc.)
│   ├── Services/               # Business logic (Payment, Auth, Notification)
│   └── Program.cs              # Entry point
│
├── clients/
│   ├── mobile/                 # Expo React Native app (Mike owns)
│   │   ├── app/                # Expo Router file-based routes
│   │   │   ├── (app)/          # Authenticated routes (tabs)
│   │   │   ├── (auth)/         # Login/register screens
│   │   │   └── _layout.tsx     # Root layout (auth check)
│   │   ├── components/         # Shared React Native components
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # Mobile-specific services
│   │   ├── app.json            # Expo config (newArchEnabled: true)
│   │   ├── eas.json            # EAS Build config
│   │   └── babel.config.js     # Babel config (reanimated plugin)
│   │
│   └── web/                    # Next.js 15 app (Quang maintains)
│       ├── app/                # App Router
│       │   ├── (auth)/         # Auth pages
│       │   ├── (dashboard)/    # Dashboard pages
│       │   ├── (home)/         # Landing pages
│       │   └── api/            # API routes, webhooks
│       └── shared/             # Web-specific components/hooks
│
├── packages/                   # Future: Shared feature packages
│   ├── features/               # Domain features (auth, bookings, payments)
│   ├── graphql/                # GraphQL codegen output
│   └── shared/                 # Shared constants, validation, testing
│
├── infrastructure/             # Terraform IaC (future)
│   └── main.tf
│
├── manifests/                  # Kubernetes manifests (future)
│
├── scripts/                    # Automation scripts
│   └── setup.sh
│
├── docs/                       # 📚 Architecture & domain documentation
│   ├── ARCHITECTURE.md         # System design, tech stack, deployment
│   ├── DOMAIN-MODEL.md         # Entity definitions, relationships
│   ├── BOOKING-LIFECYCLE.md    # Booking state machine
│   ├── API-CONTRACTS.md        # GraphQL operations reference
│   ├── MOBILE-SCREENS.md       # Mobile screen specs
│   ├── TESTING.md              # Testing strategy & patterns
│   ├── EXTENSIBILITY.md        # Adding new space types
│   ├── FILE-HANDLING.md        # Upload/download flows
│   ├── NOTIFICATIONS.md        # Push notification logic
│   ├── AUDIT-TRAIL.md          # Activity logging
│   ├── CI-CD.md                # Deployment pipelines
│   ├── GITHUB-SETUP.md         # GitHub Actions setup
│   └── DAILY-WORKFLOW.md       # Daily dev workflow
│
├── .cursor/rules/              # 🤖 AI context files (for Cursor/Claude)
│   ├── 00-project-overview.mdc # Business context, MVP scope
│   ├── 01-architecture.mdc     # Monorepo structure, bulletproof pattern
│   ├── 02-domain-model.mdc     # TypeScript types, GraphQL schema
│   ├── 03-booking-lifecycle.mdc# Booking status transitions
│   ├── 04-payment-flow.mdc     # Stripe Connect, two-stage payouts
│   ├── 05-mobile-development.mdc # Expo patterns, React Native best practices
│   ├── 06-graphql-patterns.mdc # Apollo Client, query/mutation patterns
│   ├── 07-code-standards.mdc   # TypeScript, linting, formatting rules
│   ├── 08-error-handling.mdc   # Error types, user messaging
│   ├── 09-testing-strategy.mdc # Unit, component, E2E testing
│   └── 10-git-workflow.mdc     # Branching, commits, PRs
│
├── .claude/commands/           # Claude Code slash commands
│   ├── feature.md              # /feature - Start new feature
│   ├── fix.md                  # /fix - Debug bug
│   ├── test.md                 # /test - Write tests
│   ├── review.md               # /review - Pre-commit review
│   └── playbook.md             # /playbook - Check roadmap
│
├── .github/
│   ├── workflows/
│   │   ├── pr-checks.yml       # Run on every PR (lint, test, typecheck)
│   │   ├── staging.yml         # Deploy to staging on merge to `staging`
│   │   └── production.yml      # Deploy to prod on merge to `main`
│   └── PULL_REQUEST_TEMPLATE.md
│
├── CLAUDE.md                   # Quick reference for AI development
├── README.md                   # (Placeholder - needs update)
└── START_HERE.md               # 👈 You are here

```

### What Goes Where

| You're working on... | Directory | Owner |
|---------------------|-----------|-------|
| Mobile UI/screens | `clients/mobile/app/` | Mike |
| Mobile components | `clients/mobile/components/` | Mike |
| Web pages | `clients/web/app/` | Quang |
| GraphQL schema | `backend/GraphQL/` | Quang |
| Database models | `backend/Models/` | Quang |
| Payment logic | `backend/Services/PaymentService.cs` | Quang |
| Auth logic | `backend/Services/AuthService.cs` | Quang |
| Tests (mobile) | `clients/mobile/**/__tests__/` | Mike |
| Tests (web) | `clients/web/**/*.test.ts` | Quang |
| Tests (backend) | `backend.Tests/` | Quang |

---

## Documentation Index

### By Purpose

#### 🏗️ Architecture & System Design

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System overview, tech stack, deployment | Starting on project, designing new features |
| [.cursor/rules/01-architecture.mdc](./.cursor/rules/01-architecture.mdc) | Monorepo structure, bulletproof pattern | Setting up packages, imports |

#### 📊 Domain Knowledge

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [.cursor/rules/00-project-overview.mdc](./.cursor/rules/00-project-overview.mdc) | Business context, target users, MVP scope | Onboarding, understanding "why" |
| [docs/DOMAIN-MODEL.md](./docs/DOMAIN-MODEL.md) | Entity definitions, relationships | Working with data models |
| [.cursor/rules/02-domain-model.mdc](./.cursor/rules/02-domain-model.mdc) | TypeScript types, GraphQL types | Writing TypeScript code |
| [docs/BOOKING-LIFECYCLE.md](./docs/BOOKING-LIFECYCLE.md) | Booking state machine, transitions | Booking features |
| [.cursor/rules/03-booking-lifecycle.mdc](./.cursor/rules/03-booking-lifecycle.mdc) | Booking status logic (code-level) | Implementing booking flows |
| [docs/EXTENSIBILITY.md](./docs/EXTENSIBILITY.md) | Adding new space types (billboard, transit) | Extending platform |

#### 💳 Payments & Files

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [docs/BOOKING-LIFECYCLE.md](./docs/BOOKING-LIFECYCLE.md) | Payment flow, two-stage payouts | Payment features |
| [.cursor/rules/04-payment-flow.mdc](./.cursor/rules/04-payment-flow.mdc) | Stripe implementation details | Debugging payments |
| [docs/FILE-HANDLING.md](./docs/FILE-HANDLING.md) | File upload/download, Cloudflare R2 | File features |

#### 📱 Mobile Development

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [.cursor/rules/05-mobile-development.mdc](./.cursor/rules/05-mobile-development.mdc) | Expo patterns, React Native best practices | Mobile development |
| [docs/MOBILE-SCREENS.md](./docs/MOBILE-SCREENS.md) | Screen specs, wireframes, flows | Building screens |
| [docs/NOTIFICATIONS.md](./docs/NOTIFICATIONS.md) | Push notification logic | Notification features |

#### 🌐 API & GraphQL

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [docs/API-CONTRACTS.md](./docs/API-CONTRACTS.md) | GraphQL operations reference | API integration |
| [.cursor/rules/06-graphql-patterns.mdc](./.cursor/rules/06-graphql-patterns.mdc) | Apollo Client, query/mutation patterns | GraphQL code |

#### ✅ Code Quality

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [.cursor/rules/07-code-standards.mdc](./.cursor/rules/07-code-standards.mdc) | TypeScript rules, linting, formatting | Before writing code |
| [.cursor/rules/08-error-handling.mdc](./.cursor/rules/08-error-handling.mdc) | Error types, user messaging | Error handling |
| [docs/TESTING.md](./docs/TESTING.md) | Testing strategy (high-level) | Planning tests |
| [.cursor/rules/09-testing-strategy.mdc](./.cursor/rules/09-testing-strategy.mdc) | Testing patterns, factories, E2E | Writing tests |

#### 🚀 Workflows & CI/CD

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [docs/DAILY-WORKFLOW.md](./docs/DAILY-WORKFLOW.md) | Day-to-day development workflow | Daily reference |
| [.cursor/rules/10-git-workflow.mdc](./.cursor/rules/10-git-workflow.mdc) | Branching, commits, PRs | Git operations |
| [docs/CI-CD.md](./docs/CI-CD.md) | Deployment pipelines | CI/CD troubleshooting |
| [docs/GITHUB-SETUP.md](./docs/GITHUB-SETUP.md) | GitHub Actions setup | CI/CD setup |
| [docs/AUDIT-TRAIL.md](./docs/AUDIT-TRAIL.md) | Activity logging | Audit features |

#### 🤖 AI Development

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [CLAUDE.md](./CLAUDE.md) | Quick reference for Claude Code | Using AI assistant |
| [.claude/commands/](./claude/commands/) | Slash command definitions | Custom commands |

---

## Tech Stack

### Frontend (Clients)

| Layer | Mobile | Web |
|-------|--------|-----|
| **Framework** | Expo SDK 54, React Native 0.81+ | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) | TypeScript (strict mode) |
| **Routing** | Expo Router v6 (file-based) | App Router (file-based) |
| **State/API** | Apollo Client 3.9+ | Apollo Client 3.9+ |
| **Styling** | StyleSheet (React Native) | Tailwind CSS 3.x |
| **Animations** | Reanimated 4.x | Framer Motion |
| **Forms** | React Hook Form + Zod | React Hook Form + Zod |
| **Payments** | Stripe React Native SDK | Stripe.js |

### Backend

| Layer | Technology | Version |
|-------|------------|---------|
| **Runtime** | .NET | 8.0 |
| **Language** | C# | 12 |
| **GraphQL** | HotChocolate | 14+ |
| **ORM** | Entity Framework Core | 8.x |
| **Database** | PostgreSQL | 16 |
| **Cache** | Redis | 7.x |
| **Auth** | .NET Identity + JWT | Built-in |

### Infrastructure & Services

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Monorepo** | Turborepo | Build orchestration |
| **Package Manager** | pnpm | Fast, disk-efficient |
| **Payments** | Stripe Connect | Marketplace payments, escrow |
| **Storage** | Cloudflare R2 | File storage (S3-compatible) |
| **CDN** | Cloudflare | File delivery |
| **Push Notifications** | Expo Push | Mobile notifications |
| **Web Hosting** | Vercel | Next.js deployment |
| **Backend Hosting** | Railway (dev), Azure (prod) | .NET hosting |
| **Database Hosting** | Railway (dev), Azure PostgreSQL (prod) | Managed PostgreSQL |
| **Mobile Builds** | EAS Build | Expo app compilation |
| **CI/CD** | GitHub Actions | Automated pipelines |

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Primary IDE |
| **Cursor** | AI-enhanced IDE (optional) |
| **Claude Code** | AI development assistant |
| **Xcode** | iOS development (Mac only) |
| **Android Studio** | Android development |
| **Postman / GraphQL Playground** | API testing |
| **Docker** | Local database |

---

## Key Architectural Decisions

### 1. Mobile: EAS Development Builds Required (Not Expo Go)

**Decision**: Use EAS custom development builds instead of Expo Go.

**Why**:
- React Native New Architecture enabled (`newArchEnabled: true` in `app.json`)
- Expo Go doesn't support New Architecture
- React Native Reanimated 4.x requires Babel plugin (`react-native-reanimated/plugin`)
- Native dependencies (gesture-handler, reanimated, svg) work better with custom builds

**Impact**:
- First build takes 15-20 minutes (subsequent builds faster)
- Developers need EAS CLI installed
- Must rebuild after adding native dependencies
- Better performance, full access to native APIs

**Files**:
- `clients/mobile/app.json` - `"newArchEnabled": true`
- `clients/mobile/eas.json` - Build profiles
- `clients/mobile/babel.config.js` - Reanimated plugin enabled

**See**: [.cursor/rules/05-mobile-development.mdc](./.cursor/rules/05-mobile-development.mdc)

---

### 2. Config-Driven Space Types (Database-Driven, Never Hardcoded)

**Decision**: All space types, categories, fees, and verification requirements are stored in the database and fetched via API.

**Why**:
- Add new space types (billboards, transit, vehicles) via admin panel without code deployments
- Extensibility is core to the business model

**Impact**:
- NEVER hardcode space type names, fees, or requirements in frontend code
- Always fetch `SpaceCategory` and `SpaceType` from GraphQL API
- Admin panel can configure new types without developer involvement

**Example**:
```typescript
// ✅ DO: Fetch from API
const { data } = useSpaceCategoriesQuery();
const categories = data?.spaceCategories ?? [];

// ❌ DON'T: Hardcode
const CATEGORIES = ['storefront', 'billboard']; // NEVER DO THIS
```

**See**: [docs/EXTENSIBILITY.md](./docs/EXTENSIBILITY.md)

---

### 3. Two-Stage Payout Flow (Stripe Connect)

**Decision**: Split owner payouts into two stages:
1. **Stage 1**: Print + install fee ($10-35) paid when owner downloads creative file
2. **Stage 2**: Remainder paid after advertiser approves installation (or auto-approves after 48 hours)

**Why**:
- Incentivizes owners to download and install promptly
- Protects advertisers from paying for incomplete work
- Reduces platform risk

**Impact**:
- Stripe escrow holds funds until both stages complete
- Backend tracks which payout stage each booking is in
- Cancellation policy varies by stage

**See**: [docs/BOOKING-LIFECYCLE.md](./docs/BOOKING-LIFECYCLE.md), [.cursor/rules/04-payment-flow.mdc](./.cursor/rules/04-payment-flow.mdc)

---

### 4. GraphQL as Single Source of Truth

**Decision**: All client-server communication via GraphQL. No REST endpoints for business logic.

**Why**:
- Type safety across entire stack (TypeScript codegen from schema)
- Single API surface
- Easier to maintain, document, and test

**Impact**:
- Frontend devs write `.graphql` files in `packages/graphql/operations/`
- GraphQL Codegen auto-generates TypeScript hooks
- All new features must define GraphQL schema first

**See**: [.cursor/rules/06-graphql-patterns.mdc](./.cursor/rules/06-graphql-patterns.mdc)

---

### 5. Bulletproof-React Feature Pattern (Future)

**Decision**: Organize shared logic into feature packages (`packages/features/`) following bulletproof-react architecture.

**Status**: Planned for Phase 2. Currently app-specific code lives in `clients/mobile` and `clients/web`.

**Why**:
- Clear separation between presentation and business logic
- Easier to share logic between mobile and web
- Better testability

**See**: [.cursor/rules/01-architecture.mdc](./.cursor/rules/01-architecture.mdc)

---

### 6. Verification Must Use In-App Camera (No Gallery Uploads)

**Decision**: Verification photos must be taken with in-app camera. Gallery uploads are disabled.

**Why**:
- Prevent fraud (uploading old/fake photos)
- Server validates GPS coordinates against listing location (within 100m)
- Timestamp verification

**Impact**:
- Mobile app requests camera + location permissions
- Backend validates GPS + timestamp on upload
- Cannot use existing photos

**See**: [docs/FILE-HANDLING.md](./docs/FILE-HANDLING.md)

---

### 7. Monorepo with Turborepo + pnpm

**Decision**: Use Turborepo for build orchestration and pnpm for package management.

**Why**:
- Fast incremental builds (only rebuild what changed)
- Shared dependencies reduce disk space
- Better than Lerna or Yarn workspaces

**Impact**:
- Use `pnpm` instead of `npm` or `yarn`
- `turbo.json` defines build pipeline
- Packages must declare dependencies in `package.json`

**See**: [.cursor/rules/01-architecture.mdc](./.cursor/rules/01-architecture.mdc)

---

## Common Commands

### Development

```bash
# Start everything
pnpm dev

# Start specific app
pnpm dev:mobile       # Mobile dev server
pnpm dev:web          # Web dev server
pnpm dev:backend      # .NET backend (alternative: cd backend && dotnet run)

# Mobile: Start with dev client
cd clients/mobile
npx expo start --dev-client
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm typecheck

# Format code
pnpm format
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# Integration tests
pnpm test:integration

# E2E tests (mobile)
pnpm test:e2e
```

### Build

```bash
# Build all packages
pnpm build

# Build specific app
pnpm --filter @elaview/mobile build
pnpm --filter @elaview/web build
```

### Mobile (EAS Build)

```bash
# Build development client
cd clients/mobile
eas build --profile development --platform ios       # iOS simulator
eas build --profile development --platform android   # Android APK

# Build for internal testing
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Submit to stores
eas submit -p ios
eas submit -p android
```

### GraphQL

```bash
# Generate TypeScript types from schema
pnpm codegen

# Watch mode (regenerate on schema changes)
pnpm codegen:watch
```

### Database (Backend)

```bash
cd backend

# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

### Git Workflow

```bash
# Start feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Commit (follow format: type(scope): description)
git add .
git commit -m "feat(spaces): add discovery map screen"

# Push
git push origin feature/your-feature-name

# Create PR on GitHub
```

### Docker (Local Database)

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Stop
docker-compose down

# View logs
docker-compose logs -f postgres
```

---

## Gotchas & Troubleshooting

### Mobile Gotchas

#### "Expo Go doesn't work!"

**Problem**: Scanning QR with Expo Go shows blank screen or errors.

**Solution**: You MUST use a custom development build (not Expo Go) because:
- `newArchEnabled: true` in `app.json`
- Reanimated 4.x requires Babel plugin

Build a dev client:
```bash
cd clients/mobile
eas build --profile development --platform ios  # or android
```

See [Quick Start: First-Time Mobile Setup](#first-time-mobile-setup-important).

---

#### "Reanimated animations don't work!"

**Problem**: Animations using `react-native-reanimated` crash or don't animate.

**Solution**: Ensure `babel.config.js` has the reanimated plugin:

```js
// clients/mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // ← Must be last!
  };
};
```

**After changing `babel.config.js`:**
```bash
npx expo start --clear
```

---

#### "GraphQL queries return old data!"

**Problem**: Apollo cache not updating after mutation.

**Solution**: Ensure mutations update cache or refetch queries:

```typescript
const [updateBooking] = useUpdateBookingMutation({
  refetchQueries: ['GetMyBookings'],  // ← Refetch affected queries
  awaitRefetchQueries: true,
});
```

Or manually update cache:
```typescript
const [updateBooking] = useUpdateBookingMutation({
  update(cache, { data }) {
    cache.modify({
      fields: {
        myBookings(existingBookings = []) {
          // Update cache manually
        },
      },
    });
  },
});
```

---

#### "Camera permission denied!"

**Problem**: `expo-camera` shows permission denied.

**Solution**:
1. Check `app.json` has `expo-camera` plugin with permission message
2. **iOS**: Delete app, reinstall (permission prompt only shows once)
3. **Android**: Check Settings > Apps > Elaview > Permissions

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Elaview to take verification photos"
        }
      ]
    ]
  }
}
```

---

### Web Gotchas

#### "Next.js build fails with GraphQL error!"

**Problem**: Web build fails with type errors related to GraphQL.

**Solution**: Run GraphQL codegen before building:

```bash
pnpm codegen
pnpm build
```

Add to CI pipeline:
```yaml
- run: pnpm codegen
- run: pnpm build
```

---

#### "Stripe webhooks not working locally!"

**Problem**: Stripe webhook events not received.

**Solution**: Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Copy the webhook signing secret and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

See [clients/web/app/api/webhooks/stripe/stripecli.md](./clients/web/app/api/webhooks/stripe/stripecli.md).

---

### Backend Gotchas

#### "Database migration fails!"

**Problem**: `dotnet ef database update` fails with constraint errors.

**Solution**:
1. Check migration file for issues
2. Drop local database and recreate:
   ```bash
   dotnet ef database drop
   dotnet ef database update
   ```

3. For production: Write manual migration script to preserve data

---

#### "Stripe Connect account creation fails!"

**Problem**: Creating connected account for space owner fails.

**Solution**:
1. Check Stripe is in test mode (use test API keys)
2. Ensure country code is supported (`US` for MVP)
3. Check Stripe dashboard for error details

---

### General Gotchas

#### "pnpm install fails!"

**Problem**: `pnpm install` fails with peer dependency errors.

**Solution**:
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

#### "Turborepo cache is stale!"

**Problem**: Changes not reflected after build.

**Solution**:
```bash
pnpm turbo run build --force
```

Or clear cache:
```bash
rm -rf node_modules/.cache
```

---

#### "GraphQL schema changes not reflected!"

**Problem**: Frontend has old types after backend schema change.

**Solution**:
1. Restart backend
2. Regenerate types:
   ```bash
   pnpm codegen
   ```
3. Restart frontend

---

#### "Git commit fails with lint errors!"

**Problem**: Pre-commit hooks fail.

**Solution**:
```bash
# Fix linting
pnpm lint:fix

# Fix formatting
pnpm format

# Commit again
git commit
```

---

## What's Next?

### For New Developers

1. **Read** [CLAUDE.md](./CLAUDE.md) - Quick reference for AI-assisted development
2. **Read** [docs/DAILY-WORKFLOW.md](./docs/DAILY-WORKFLOW.md) - Day-to-day workflow
3. **Read** [.cursor/rules/00-project-overview.mdc](./.cursor/rules/00-project-overview.mdc) - Business context
4. **Skim** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System overview
5. **Start building!** Pick a task, create a branch, work with Claude Code

### For Working on Features

| If you're building... | Read these first |
|-----------------------|------------------|
| **Mobile screen** | [docs/MOBILE-SCREENS.md](./docs/MOBILE-SCREENS.md), [.cursor/rules/05-mobile-development.mdc](./.cursor/rules/05-mobile-development.mdc) |
| **Booking feature** | [docs/BOOKING-LIFECYCLE.md](./docs/BOOKING-LIFECYCLE.md), [.cursor/rules/03-booking-lifecycle.mdc](./.cursor/rules/03-booking-lifecycle.mdc) |
| **Payment feature** | [.cursor/rules/04-payment-flow.mdc](./.cursor/rules/04-payment-flow.mdc) |
| **GraphQL query/mutation** | [docs/API-CONTRACTS.md](./docs/API-CONTRACTS.md), [.cursor/rules/06-graphql-patterns.mdc](./.cursor/rules/06-graphql-patterns.mdc) |
| **Tests** | [docs/TESTING.md](./docs/TESTING.md), [.cursor/rules/09-testing-strategy.mdc](./.cursor/rules/09-testing-strategy.mdc) |

---

## Team Contacts

- **Mike Anderson** (@mike-anderson) - Mobile app, frontend lead
- **Quang** (@quang-cap) - Backend, web app, infrastructure

---

## Getting Help

- **General questions**: Check this file first!
- **Architecture questions**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **API questions**: [docs/API-CONTRACTS.md](./docs/API-CONTRACTS.md)
- **Testing questions**: [docs/TESTING.md](./docs/TESTING.md)
- **CI/CD issues**: [docs/CI-CD.md](./docs/CI-CD.md)
- **GitHub Setup**: [docs/GITHUB-SETUP.md](./docs/GITHUB-SETUP.md)

---

**Welcome to Elaview! Let's build something great. 🚀**

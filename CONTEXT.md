# Agent Context

> Last updated: 2026-03-12

## Project Overview

B2B advertising marketplace connecting local advertisers with physical ad space owners (storefronts, windows, walls).

### Business Core
- **Space Owners**: List physical inventory (windows, screens, walls).
- **Advertisers**: Find spaces, upload creative, and pay via Stripe.
- **Workflow**: Two-stage payout (install fee + final payout after verification).
- **Onboarding**: See [ONBOARDING.md](file:///home/md/Desktop/code/elaview-production/ONBOARDING.md) for a beginner-friendly guide.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | .NET 10 + HotChocolate GraphQL |
| Web | Next.js 16 + App Router |
| Mobile | Expo SDK 54 + React Native |
| API | GraphQL via Apollo Client |
| Payments | Stripe Connect (two-stage payout) |
| Storage | Cloudflare R2 |
| Package Manager | bun (never npm/yarn/pnpm) |
| Environment | devbox + Doppler (secrets) |
| Infra | OpenTofu (Vercel for web, Railway for backend) |

## Environment

- **devbox** manages all dev tools (bun, dotnet, docker, doppler, etc.)
- `devbox shell` must be active before running any project commands
- Secrets loaded via **Doppler** (auto-loaded in devbox init hook)
- `ev` CLI (sourced from `scripts/init/env.sh`) provides all project commands

### What runs INSIDE `devbox shell` vs OUTSIDE?

**INSIDE (Project Dependencies & Scripts):**
- `ev backend:start` / `ev web:build` / `ev *`
- `bun install` and `bun run dev`
- `cd clients/* && bun ...`
- Database migrations and `doppler` commands
- *Rule of Thumb: If it touches code or dependencies, open a terminal tab and run `devbox shell` first.*

**OUTSIDE (Global System Tools):**
- General Git operations (`git commit`, `git pull`)
- System installations (`apt`, `brew`)

## Key Commands (run inside devbox shell)

| Command | Purpose |
|---------|---------|
| `ev web:install` | Install web dependencies |
| `cd clients/web && bun dev` | Run web dev server |
| `ev backend:start` | Start backend (requires Docker) |
| `ev backend:stop` | Stop backend |
| `ev web:build` | Build web client |
| `ev web:test` | Run web tests |

## Project Structure

```
elaview-production/
├── backend/           # .NET GraphQL API
├── clients/
│   ├── mobile/        # Expo React Native
│   └── web/           # Next.js 16 (App Router)
├── scripts/           # ev CLI commands & init hooks
├── devbox.json        # Dev environment definition
├── docs/              # Architecture docs
└── infra/             # OpenTofu IaC
```

## Prerequisites

- Docker running (for backend)
- devbox shell active (for all commands)
- Doppler logged in (for secrets)

## Running the Web Client (clients/web)

All commands must be run inside `devbox shell`.

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `devbox shell` | Load dev tools + Doppler secrets |
| 2 | `ev backend:start` | Start Docker containers + .NET GraphQL API |
| 3 | `ev web:install` | Install bun dependencies for web |
| 4 | `cd clients/web && bun gql:codegen` | Generate GraphQL types from schema |
| 5 | `cd clients/web && bun dev` | Start Next.js dev server → http://localhost:3000 |

> **Important:** Docker must be running before step 2. Step 4 must be re-run whenever the GraphQL schema changes.

## Seeding Dashboard Dummy Data

> **⚠️ REMOVED (as of 2026-03-10):** The `scripts/seed-dashboard/` folder previously contained a standalone bun script for populating dashboard tabs with dummy data. This folder has been deleted from the repo and **no longer exists**. Do NOT attempt to run `cd scripts/seed-dashboard && bun run seed` — it will fail. There is currently no automated seeding script in the project.

## Architectural Reality (Overrides START_HERE.md & .cursor/rules/)

- **Backend Folder Structure**: Uses **Vertical Slice Architecture** in `backend/Features/` (Analytics, Auth, Marketplace, etc.). Each feature folder contains its own queries, mutations, and domain logic.
- **Frontend/Monorepo Status**: `packages/` does NOT exist yet. `clients/mobile` and `clients/web` are standalone.
- **Web Structure**: Next.js 16 app is located in `clients/web/src/app/`.
- **Mobile Structure**: Expo Router app is located in `clients/mobile/src/app/`.
- **Package Manager**: Strictly `bun`. Do not use npm/yarn.

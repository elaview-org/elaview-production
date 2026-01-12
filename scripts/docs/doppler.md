# Doppler Secrets Management

## Overview

Doppler is used for centralized secrets/env var management across dev, staging, and production environments.

## Free Tier Limits (Developer Plan)

| Resource | Limit |
|----------|-------|
| Users | 3 free, then $8/user/mo |
| Projects | 10 |
| Environments per project | 4 |
| Configs per environment | 10 |
| Secrets per config | Unlimited |
| Config syncs (integrations) | 5 |
| Service tokens | 50 |
| Activity log retention | 3 days |

## Project Structure

```
elaview/
├── dev/          # Development
│   ├── dev       # Local dev config
│   └── dev_ci    # CI config (optional)
├── staging/      # Staging
│   └── stg
└── production/   # Production
    └── prd
```

## CLI Usage (Does NOT Count as Sync)

```bash
# Download secrets to .env file
doppler secrets download --no-file --format env > .env

# Run command with secrets injected
doppler run -- ev backend:start

# View secrets
doppler secrets

# Set a secret
doppler secrets set API_KEY=xxx

# Delete a secret
doppler secrets delete API_KEY
```

## What Counts as a Sync?

**Syncs (consume 5 free limit):**
- Doppler → Vercel auto-sync
- Doppler → AWS Secrets Manager
- Doppler → GitHub Actions secrets
- Doppler → Netlify, Railway, Fly.io, etc.

**Not syncs (unlimited):**
- CLI pulls (`doppler secrets download`)
- CLI run (`doppler run -- command`)
- API access
- Service token usage

## Integration with ev CLI

Add to `scripts/cmd/env.sh`:

```bash
env:pull() {
    if ! command -v doppler >/dev/null 2>&1; then
        printf "\033[31m✗\033[0m Doppler CLI not installed\n" >&2
        echo "Install: curl -sLf --retry 3 --tlsv1.2 --proto '=https' 'https://cli.doppler.com/install.sh' | sh"
        return 1
    fi
    doppler secrets download --no-file --format env > "$ELAVIEW_DEVBOX_ROOT/.env"
    printf "\033[32m✓\033[0m Secrets pulled from Doppler\n"
}

env:push() {
    if ! command -v doppler >/dev/null 2>&1; then
        printf "\033[31m✗\033[0m Doppler CLI not installed\n" >&2
        return 1
    fi
    doppler secrets upload "$ELAVIEW_DEVBOX_ROOT/.env"
    printf "\033[32m✓\033[0m Secrets pushed to Doppler\n"
}
```

## Setup

```bash
# Install Doppler CLI
curl -sLf --retry 3 --tlsv1.2 --proto "=https" "https://cli.doppler.com/install.sh" | sh

# Login
doppler login

# Setup project (run in repo root)
doppler setup

# Verify
doppler secrets
```

## Environment Switching

```bash
# Switch to staging
doppler setup --config stg

# Switch to production
doppler setup --config prd

# Or specify per-command
doppler run --config prd -- ev backend:start
```

## CI/CD Usage

Use service tokens (not user tokens) in CI:

```yaml
# GitHub Actions example
env:
  DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}

steps:
  - run: doppler secrets download --no-file --format env > .env
```

## Resources

- Pricing: https://www.doppler.com/pricing
- CLI Docs: https://docs.doppler.com/docs/cli
- Integrations: https://docs.doppler.com/docs/integrations
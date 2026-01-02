# Elaview GitHub Setup Guide

> Step-by-step guide for configuring the Elaview GitHub repository.

## Table of Contents

- [Initial Setup Checklist](#initial-setup-checklist)
- [Branch Protection Rules](#1-branch-protection-rules)
- [Secrets Configuration](#2-add-secrets)
- [Variables Configuration](#3-add-variables)
- [Environments](#4-create-environments)
- [GitHub Actions](#5-enable-github-actions)
- [GitHub Apps](#6-install-github-apps)
- [Team Permissions](#7-team-permissions)
- [Labels](#8-create-labels)
- [Issue Templates](#9-issue-templates)
- [PR Template](#10-pr-template)
- [Milestones](#11-create-milestones)
- [CODEOWNERS](#12-codeowners)
- [Verification Checklist](#verification-checklist)

---

## Initial Setup Checklist

Quick reference for all setup tasks:

| Task | Location | Status |
|------|----------|--------|
| Branch protection (main) | Settings → Branches | ☐ |
| Branch protection (develop) | Settings → Branches | ☐ |
| Repository secrets | Settings → Secrets | ☐ |
| Repository variables | Settings → Variables | ☐ |
| Environments (staging, production) | Settings → Environments | ☐ |
| GitHub Actions permissions | Settings → Actions | ☐ |
| Codecov integration | GitHub Marketplace | ☐ |
| Vercel integration | GitHub Apps | ☐ |
| Slack integration | GitHub Marketplace | ☐ |
| Team permissions | Settings → Collaborators | ☐ |
| Labels | Issues → Labels | ☐ |
| Issue templates | .github/ISSUE_TEMPLATE/ | ☐ |
| PR template | .github/PULL_REQUEST_TEMPLATE.md | ☐ |
| CODEOWNERS | .github/CODEOWNERS | ☐ |
| Milestones | Issues → Milestones | ☐ |

---

## 1. Branch Protection Rules

Go to **Settings → Branches → Add branch protection rule**

### For `main` (Production)

| Setting | Value |
|---------|-------|
| Branch name pattern | `main` |
| Require a pull request before merging | ✅ |
| Require approvals | **2** |
| Dismiss stale PR approvals on new commits | ✅ |
| Require review from Code Owners | ✅ |
| Require status checks to pass | ✅ |
| Require branches to be up to date | ✅ |
| Do not allow bypassing settings | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

**Required status checks:**
- `lint`
- `typecheck`
- `test-unit`
- `test-integration`
- `build`

### For `develop` (Staging)

| Setting | Value |
|---------|-------|
| Branch name pattern | `develop` |
| Require a pull request before merging | ✅ |
| Require approvals | **1** |
| Dismiss stale PR approvals on new commits | ✅ |
| Require status checks to pass | ✅ |
| Require branches to be up to date | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

**Required status checks:**
- `lint`
- `typecheck`
- `test-unit`
- `build`

### Branch Protection via CLI

```bash
# Install GitHub CLI if needed
brew install gh

# Protect main branch
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["lint","typecheck","test-unit","test-integration","build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":2}'
```

---

## 2. Add Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Dashboard → Team Settings → General |
| `VERCEL_PROJECT_ID_WEB` | Web app project ID | Vercel Project → Settings → General |
| `EXPO_TOKEN` | EAS access token | [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens) |
| `TURBO_TOKEN` | Turborepo remote cache | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `SLACK_WEBHOOK_URL` | Slack notifications | [api.slack.com/apps](https://api.slack.com/apps) → Incoming Webhooks |
| `CODECOV_TOKEN` | Coverage uploads | [codecov.io](https://codecov.io) → Repo Settings |
| `SENTRY_AUTH_TOKEN` | Sentry releases | [sentry.io/settings/auth-tokens](https://sentry.io/settings/auth-tokens/) |

### Azure Secrets (Backend)

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `AZURE_CREDENTIALS` | Service principal JSON | Azure CLI: `az ad sp create-for-rbac` |
| `AZURE_WEBAPP_NAME` | App Service name | Azure Portal |

### Apple Secrets (iOS Builds)

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `APPLE_ID` | Apple ID email | Your Apple Developer account |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password | [appleid.apple.com](https://appleid.apple.com) |
| `ASC_API_KEY_ID` | App Store Connect key ID | App Store Connect → Users → Keys |
| `ASC_ISSUER_ID` | App Store Connect issuer | App Store Connect → Users → Keys |
| `ASC_API_KEY` | Base64-encoded .p8 file | `base64 -i AuthKey_XXX.p8` |

### Google Play Secrets (Android Builds)

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Base64 JSON key | Google Cloud Console → Service Accounts |

### Add Secret via CLI

```bash
# Add a secret
gh secret set VERCEL_TOKEN --body "your-token-here"

# Add from file
gh secret set ASC_API_KEY < AuthKey_XXX.p8.base64

# List secrets
gh secret list
```

---

## 3. Add Variables

Go to **Settings → Secrets and variables → Actions → Variables → New repository variable**

| Variable | Value | Description |
|----------|-------|-------------|
| `TURBO_TEAM` | `elaview` | Turborepo team name |
| `SENTRY_ORG` | `elaview` | Sentry organization slug |
| `SENTRY_PROJECT_WEB` | `elaview-web` | Sentry web project |
| `SENTRY_PROJECT_MOBILE` | `elaview-mobile` | Sentry mobile project |
| `NODE_VERSION` | `20` | Node.js version |
| `PNPM_VERSION` | `9` | pnpm version |

### Add Variable via CLI

```bash
gh variable set TURBO_TEAM --body "elaview"
gh variable list
```

---

## 4. Create Environments

Go to **Settings → Environments → New environment**

### Staging Environment

| Setting | Value |
|---------|-------|
| Name | `staging` |
| Required reviewers | None |
| Wait timer | None |
| Deployment branches | `develop` only |

**Environment secrets (if different from repo):**
- None typically needed

### Production Environment

| Setting | Value |
|---------|-------|
| Name | `production` |
| Required reviewers | `mike-anderson`, `quang-cap` |
| Wait timer | **5 minutes** |
| Deployment branches | `main` only |

**Environment secrets:**
- Production-specific API keys if different

### Environment Setup via CLI

```bash
# Create production environment with protection
gh api repos/{owner}/{repo}/environments/production \
  --method PUT \
  --field wait_timer=300 \
  --field reviewers='[{"type":"User","id":123}]'
```

---

## 5. Enable GitHub Actions

Go to **Settings → Actions → General**

### Actions Permissions

| Setting | Value |
|---------|-------|
| Actions permissions | Allow all actions and reusable workflows |
| Workflow permissions | Read and write permissions |
| Allow GitHub Actions to create PRs | ✅ |

### Runners

For most workflows, GitHub-hosted runners are sufficient:
- `ubuntu-latest` for Linux jobs
- `macos-latest` for iOS builds and E2E tests

---

## 6. Install GitHub Apps

### Codecov (Code Coverage)

1. Go to [github.com/marketplace/codecov](https://github.com/marketplace/codecov)
2. Install and authorize for the repository
3. Get token from Codecov dashboard
4. Add `CODECOV_TOKEN` to repository secrets

**Features:**
- Coverage reports on PRs
- Coverage diff comments
- Coverage badges

### Vercel (Preview Deployments)

1. Go to [github.com/apps/vercel](https://github.com/apps/vercel)
2. Install and authorize for the repository
3. Link to Vercel project in Vercel dashboard

**Features:**
- Automatic preview URLs on PRs
- Deployment status checks
- Preview comments

### Slack Integration (Optional)

1. Go to [github.com/marketplace/slack-github](https://github.com/marketplace/slack-github)
2. Install and authorize
3. In Slack, run `/github subscribe elaview-org/elaview-production`

**Recommended subscriptions:**
```
/github subscribe elaview-org/elaview-production issues pulls deployments
```

### Dependabot

Already built into GitHub. Enable via:

1. Go to **Settings → Code security and analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"
```

---

## 7. Team Permissions

Go to **Settings → Collaborators and teams**

### Team Roles

| User/Team | Role | Access Level |
|-----------|------|--------------|
| `@mike-anderson` | Admin | Full access, settings |
| `@quang-cap` | Admin | Full access, settings |
| `@elaview-org/developers` | Write | Push to non-protected branches |
| `@elaview-org/contractors` | Triage | Issues and PRs only |

### Role Capabilities

| Permission | Admin | Write | Triage | Read |
|------------|-------|-------|--------|------|
| Push to protected branches | Via PR | Via PR | ❌ | ❌ |
| Merge PRs | ✅ | ✅ | ❌ | ❌ |
| Manage issues | ✅ | ✅ | ✅ | ❌ |
| Manage settings | ✅ | ❌ | ❌ | ❌ |
| Delete repository | ✅ | ❌ | ❌ | ❌ |

---

## 8. Create Labels

Go to **Issues → Labels → New label**

### Feature Labels

| Label | Color | Description |
|-------|-------|-------------|
| `feature` | `#0E8A16` | New feature or enhancement |
| `bug` | `#D73A4A` | Something isn't working |
| `refactor` | `#FEF2C0` | Code improvement, no behavior change |
| `docs` | `#0075CA` | Documentation only |
| `chore` | `#EDEDED` | Maintenance, deps, tooling |

### Area Labels

| Label | Color | Description |
|-------|-------|-------------|
| `mobile` | `#7057FF` | Mobile app (Expo/React Native) |
| `web` | `#008672` | Web app (Next.js) |
| `backend` | `#E99695` | Backend API (.NET) |
| `shared` | `#C5DEF5` | Shared packages |
| `infra` | `#BFD4F2` | Infrastructure, CI/CD |

### Priority Labels

| Label | Color | Description |
|-------|-------|-------------|
| `P0-critical` | `#B60205` | Production down, data loss |
| `P1-high` | `#D93F0B` | Major feature broken |
| `P2-medium` | `#FBCA04` | Minor feature broken |
| `P3-low` | `#0E8A16` | Nice to have |

### Special Labels

| Label | Color | Description |
|-------|-------|-------------|
| `payments` | `#B60205` | Payment-related (requires extra review) |
| `auth` | `#B60205` | Auth-related (requires extra review) |
| `security` | `#B60205` | Security-related |
| `blocked` | `#000000` | Blocked by external dependency |
| `help-wanted` | `#008672` | Extra attention needed |
| `good-first-issue` | `#7057FF` | Good for newcomers |
| `wontfix` | `#FFFFFF` | Will not be worked on |
| `duplicate` | `#CFD3D7` | Duplicate of another issue |

### Create Labels via CLI

```bash
# Create a label
gh label create "feature" --color "0E8A16" --description "New feature"

# List labels
gh label list

# Create all labels from file
# labels.json: [{"name": "feature", "color": "0E8A16", "description": "New feature"}]
cat labels.json | jq -c '.[]' | while read label; do
  gh label create $(echo $label | jq -r '.name') \
    --color $(echo $label | jq -r '.color') \
    --description "$(echo $label | jq -r '.description')"
done
```

---

## 9. Issue Templates

Create `.github/ISSUE_TEMPLATE/` directory with the following files:

### Bug Report Template

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml

name: 🐛 Bug Report
description: Report a bug or issue
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report this bug!
        
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Brief description of the bug
      placeholder: What happened?
    validations:
      required: true
      
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce this issue?
      placeholder: |
        1. Go to...
        2. Click on...
        3. See error
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What should happen?
    validations:
      required: true
      
  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happens?
    validations:
      required: true
      
  - type: dropdown
    id: platform
    attributes:
      label: Platform
      options:
        - Mobile (iOS)
        - Mobile (Android)
        - Web
        - Backend/API
    validations:
      required: true
      
  - type: input
    id: version
    attributes:
      label: App Version
      placeholder: e.g., 1.2.3
      
  - type: input
    id: device
    attributes:
      label: Device
      placeholder: e.g., iPhone 14 Pro, Pixel 7
      
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots
      
  - type: textarea
    id: logs
    attributes:
      label: Logs
      description: Any relevant error logs
      render: shell
```

### Feature Request Template

```yaml
# .github/ISSUE_TEMPLATE/feature_request.yml

name: ✨ Feature Request
description: Suggest a new feature
labels: ["feature"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a feature!
        
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What problem does this solve?
      placeholder: I'm frustrated when...
    validations:
      required: true
      
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: How should this work?
    validations:
      required: true
      
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Other approaches you've thought about
      
  - type: dropdown
    id: platform
    attributes:
      label: Platform
      options:
        - Mobile
        - Web
        - Both
        - Backend/API
    validations:
      required: true
      
  - type: textarea
    id: context
    attributes:
      label: Additional Context
      description: Screenshots, mockups, examples
```

### Config File

```yaml
# .github/ISSUE_TEMPLATE/config.yml

blank_issues_enabled: false
contact_links:
  - name: 💬 Discord Community
    url: https://discord.gg/elaview
    about: Ask questions and discuss features
  - name: 📚 Documentation
    url: https://docs.elaview.com
    about: Check the docs first
```

---

## 10. PR Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Summary

Brief description of changes.

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ Feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that causes existing functionality to change)
- [ ] 📚 Documentation (changes to documentation only)
- [ ] 🔧 Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] 🧹 Chore (maintenance, dependencies, tooling)

## Related Issues

Closes #

## Changes Made

- Change 1
- Change 2

## Screenshots

If applicable, add screenshots or videos.

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

### Test Instructions

How to test these changes manually.

## Checklist

- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## Notes for Reviewers

Any additional context for reviewers.
```

---

## 11. Create Milestones

Go to **Issues → Milestones → New milestone**

| Milestone | Due Date | Description |
|-----------|----------|-------------|
| 🚀 MVP Launch | TBD | Core features for first release |
| 🔧 Post-MVP Polish | MVP + 2 weeks | Bug fixes, UX improvements |
| ✨ Phase 2 Features | MVP + 4 weeks | Messaging, analytics, reviews |
| 🧹 Technical Debt | Ongoing | Refactoring, test coverage, docs |
| 📱 Mobile v2 | TBD | Major mobile app update |

### Milestone via CLI

```bash
gh api repos/{owner}/{repo}/milestones \
  --method POST \
  --field title="MVP Launch" \
  --field description="Core features for first release" \
  --field due_on="2026-03-01T00:00:00Z"
```

---

## 12. CODEOWNERS

Create `.github/CODEOWNERS`:

```bash
# Default owners for everything
* @mike-anderson @quang-cap

# Mobile app (Mike)
/clients/mobile/ @mike-anderson

# Web app (shared)
/clients/web/ @mike-anderson @quang-cap

# Backend (Quang)
/backend/ @quang-cap

# Shared packages
/packages/ @mike-anderson @quang-cap

# Infrastructure and CI/CD
/.github/ @mike-anderson @quang-cap
/infrastructure/ @mike-anderson @quang-cap

# Documentation
/docs/ @mike-anderson

# Critical paths - require both reviewers
/clients/mobile/src/features/payment/ @mike-anderson @quang-cap
/clients/mobile/src/features/booking/ @mike-anderson @quang-cap
/backend/GraphQL/Mutations/Payment* @mike-anderson @quang-cap
/backend/GraphQL/Mutations/Booking* @mike-anderson @quang-cap
```

---

## Verification Checklist

After completing setup, verify each item:

### Branch Protection

- [ ] Cannot push directly to `main`
- [ ] Cannot push directly to `develop`
- [ ] PR to `main` requires 2 approvals
- [ ] PR to `develop` requires 1 approval
- [ ] Status checks are required before merge

### CI/CD

- [ ] CI runs automatically on PR creation
- [ ] All status checks appear on PRs
- [ ] Staging deploy triggers on merge to `develop`
- [ ] Production deploy requires environment approval

### Integrations

- [ ] Vercel creates preview deployments on PRs
- [ ] Codecov comments on PRs with coverage
- [ ] Slack receives notifications
- [ ] Dependabot creates security PRs

### Team

- [ ] All team members have correct access levels
- [ ] CODEOWNERS is respected on PRs
- [ ] Issue templates work correctly
- [ ] PR template appears on new PRs

### Quick Verification Commands

```bash
# Check branch protection
gh api repos/{owner}/{repo}/branches/main/protection

# Check secrets are set
gh secret list

# Check variables are set
gh variable list

# Check environments
gh api repos/{owner}/{repo}/environments

# Check labels
gh label list

# Check CODEOWNERS syntax
cat .github/CODEOWNERS
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Status checks not appearing | Wait for first workflow run |
| CODEOWNERS not working | Check file path syntax |
| Secrets not available | Check environment scoping |
| Preview deploys failing | Verify Vercel project linking |

### Reset Branch Protection

```bash
# Remove protection (careful!)
gh api repos/{owner}/{repo}/branches/main/protection --method DELETE

# Re-apply protection
gh api repos/{owner}/{repo}/branches/main/protection --method PUT ...
```

---

## Related Documentation

- [CI-CD](./CI-CD.md) - CI/CD pipeline details
- [Testing](./TESTING.md) - Test requirements
- [Architecture](./ARCHITECTURE.md) - System overview

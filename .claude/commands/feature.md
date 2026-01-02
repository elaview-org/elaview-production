# /feature - Start a New Feature

When the user runs `/feature <name>`, help them scaffold a new feature.

## Steps

1. **Determine feature scope:**
   - Which app? (mobile, web, shared)
   - Which domain? (spaces, bookings, payments, verification, auth)

2. **Create branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<name>
   ```

3. **Scaffold files based on domain:**

   For a feature in `packages/features/<domain>/`:
   ```
   packages/features/<domain>/
   ├── components/
   │   ├── <Component>.tsx
   │   └── <Component>.test.tsx
   ├── hooks/
   │   ├── use<Hook>.ts
   │   └── use<Hook>.test.ts
   └── utils/
       ├── <util>.ts
       └── <util>.test.ts
   ```

4. **Load relevant context:**
   - Domain model: `.cursor/rules/02-domain-model.mdc`
   - If booking-related: `.cursor/rules/03-booking-lifecycle.mdc`
   - If payment-related: `.cursor/rules/04-payment-flow.mdc`
   - Testing: `.cursor/rules/09-testing-strategy.mdc`

5. **Remind developer:**
   - Write tests alongside code
   - Follow commit format: `feat(<scope>): <description>`
   - PR requires tests + description

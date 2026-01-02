# /fix - Fix a Bug

When the user runs `/fix <description>`, help them debug and fix an issue.

## Steps

1. **Understand the bug:**
   - What's the expected behavior?
   - What's the actual behavior?
   - Steps to reproduce?

2. **Create branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b fix/<short-name>
   ```

3. **Load relevant context based on bug area:**
   - Payment issues: `.cursor/rules/04-payment-flow.mdc`
   - Booking issues: `.cursor/rules/03-booking-lifecycle.mdc`
   - Mobile issues: `.cursor/rules/05-mobile-development.mdc`
   - Error handling: `.cursor/rules/08-error-handling.mdc`

4. **Debug approach:**
   - Check error logs/Sentry
   - Reproduce locally
   - Write failing test first (TDD)
   - Fix the issue
   - Verify test passes

5. **Commit format:** `fix(<scope>): <description>`

# /test - Write Tests

When the user runs `/test <file-or-component>`, help them write tests.

## Steps

1. **Identify test type needed:**
   - Pure function → Unit test
   - React component → Component test
   - Hook → Hook test
   - Multi-step flow → Integration test
   - Critical path → E2E test

2. **Load testing context:**
   - `.cursor/rules/09-testing-strategy.mdc`
   - `docs/TESTING.md`

3. **Use test factories:**
   ```typescript
   import { 
     createMockUser,
     createMockBooking,
     createMockSpace,
     createMockSpaceType,
     createMockSpaceCategory 
   } from '@elaview/shared/testing';
   ```

4. **Follow patterns:**
   - Arrange-Act-Assert
   - Test behavior, not implementation
   - One assertion focus per test
   - Co-locate: `Component.tsx` + `Component.test.tsx`

5. **Run tests:**
   ```bash
   pnpm test <filename>        # Single file
   pnpm test:watch             # Watch mode
   pnpm test:coverage          # With coverage
   ```

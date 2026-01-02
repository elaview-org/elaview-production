# /review - Review Code

When the user runs `/review`, analyze the current file or staged changes.

## Check For

### Code Quality
- [ ] TypeScript strict compliance
- [ ] No `any` types without justification
- [ ] Proper error handling (try/catch, error boundaries)
- [ ] No console.log or debug code

### Security (especially for payments/auth)
- [ ] Input validation with Zod
- [ ] Auth checks on protected operations
- [ ] No secrets in code
- [ ] Parameterized queries (no SQL injection)

### Testing
- [ ] Tests exist for new code
- [ ] Tests follow AAA pattern
- [ ] Using factories, not hardcoded data
- [ ] Edge cases covered

### Elaview-Specific
- [ ] Space types read from config, not hardcoded
- [ ] Booking status transitions follow state machine
- [ ] Payment flow follows two-stage pattern
- [ ] testID props on interactive elements

### Style
- [ ] Follows naming conventions
- [ ] Imports ordered correctly
- [ ] No unused imports/variables

## Output Format

```
## Code Review: <filename>

### ✅ Looks Good
- Item 1
- Item 2

### ⚠️ Suggestions
- Item 1: Explanation

### ❌ Issues (Must Fix)
- Item 1: Explanation

### 📝 Tests Needed
- Test case 1
- Test case 2
```

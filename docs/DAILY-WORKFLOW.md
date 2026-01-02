# Daily Development Workflow

> Quick reference for working with Claude Code on Elaview. Keep this open until it's second nature.

---

## 🌅 Starting Your Day

```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Check what's next
claude
> /playbook <phase>
```

---

## 🚀 Starting a Feature

```bash
# 1. Create branch
git checkout -b feature/<name>

# 2. Tell Claude Code what you're building (be specific!)
```

**Good prompt template:**

```
I'm building [SCREEN/COMPONENT NAME] for [USER TYPE].

Purpose: [What it does]

Reference these docs:
- docs/MOBILE-SCREENS.md for specs
- .cursor/rules/0X-relevant-file.mdc for patterns

Requirements:
- [Requirement 1]
- [Requirement 2]
- Uses [GraphQL query/mutation]
- Needs testID props for E2E

Please create:
1. The component(s)
2. The hook(s)
3. Tests for each
```

---

## 🔧 Claude Code Commands

| Command | Use When |
|---------|----------|
| `/feature <name>` | Starting new feature |
| `/fix <description>` | Debugging a bug |
| `/test <component>` | Writing tests |
| `/review` | Before committing |
| `/playbook <phase>` | Check progress |

Phases: `setup`, `auth`, `advertiser`, `owner`, `polish`, `testing`, `launch`

---

## ✅ Before Every Commit

```bash
pnpm test          # Tests pass?
pnpm typecheck     # TypeScript OK?
pnpm lint          # Linting OK?
```

---

## 📝 Commit Format

```bash
git commit -m "type(scope): short description

- Detail 1
- Detail 2"
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**Scopes:** `auth`, `spaces`, `bookings`, `payments`, `verification`, `mobile`, `web`, `graphql`

**Examples:**

```bash
git commit -m "feat(spaces): add discovery map screen"
git commit -m "fix(payments): handle retry on failure"
git commit -m "test(bookings): add BookingCard tests"
```

---

## 🔄 Daily Loop

```
Pick task → Branch → Build with Claude → Test → Commit → Push → PR → Review → Merge → Repeat
```

**Detailed:**

| Time | Action |
|------|--------|
| Start | `git checkout develop && git pull` |
| Pick task | `/playbook <phase>` |
| Branch | `git checkout -b feature/<name>` |
| Build | Work with Claude Code (code + tests) |
| Verify | `pnpm test && pnpm typecheck && pnpm lint` |
| Commit | Small, logical commits |
| Push | `git push origin feature/<name>` |
| PR | Create PR, fill template, add screenshots |
| Review | Address feedback |
| Merge | Squash and merge to develop |

---

## 💬 Effective Claude Prompts

### ✅ Do This

```
Create the BookingCard component.

Requirements:
- Display: photo, title, dates, status badge, price
- Status colors from 03-booking-lifecycle.mdc
- Props: booking, onPress
- Include loading skeleton variant
- Add testID="booking-card-{id}"

Reference 02-domain-model.mdc for Booking entity.
Create component and test file.
```

### ❌ Not This

```
Make a booking card
```

### Pro Tips

1. **Load context first:**
   ```
   Read CLAUDE.md and .cursor/rules/07-code-standards.mdc first.
   ```

2. **Build incrementally:**
   ```
   First, show me the type definitions.
   [review]
   Now implement the hook.
   [review]
   Now the component.
   ```

3. **Always ask for tests:**
   ```
   Create the component AND its test file.
   ```

4. **Use /review before commit:**
   ```
   /review
   ```

---

## 🚨 When Stuck

**CI Fails:**
```
CI failed on [job]. Error:
[paste error]
How do I fix this?
```

**Test Fails:**
```
This test fails:
[paste test + error]
Component:
[paste code]
```

**Bug:**
```
/fix <short-description>

Expected: [X]
Actual: [Y]
Steps to reproduce: [...]
```

---

## 📁 Key Files to Reference

| Need | File |
|------|------|
| Entity types | `.cursor/rules/02-domain-model.mdc` |
| Booking statuses | `.cursor/rules/03-booking-lifecycle.mdc` |
| Payment logic | `.cursor/rules/04-payment-flow.mdc` |
| Mobile patterns | `.cursor/rules/05-mobile-development.mdc` |
| GraphQL patterns | `.cursor/rules/06-graphql-patterns.mdc` |
| Code standards | `.cursor/rules/07-code-standards.mdc` |
| Error handling | `.cursor/rules/08-error-handling.mdc` |
| Testing | `.cursor/rules/09-testing-strategy.mdc` |
| Screen specs | `docs/MOBILE-SCREENS.md` |
| API contracts | `docs/API-CONTRACTS.md` |

---

## 🔑 Golden Rules

1. **One feature = one branch = one PR**
2. **Code + tests together** (never skip tests)
3. **Small, frequent commits**
4. **Run checks before push**
5. **Be specific with Claude**
6. **Review AI output** (Claude isn't perfect)
7. **Never hardcode space types** (read from API)
8. **Always add testID props**

---

## 📱 Manual Testing Checklist

Before PR:

- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Loading states work
- [ ] Error states work
- [ ] Empty states work
- [ ] Keyboard doesn't cover inputs
- [ ] Tappable areas are 44x44 minimum

---

## 🆘 Help

- **Architecture:** `docs/ARCHITECTURE.md`
- **API specs:** `docs/API-CONTRACTS.md`
- **Testing:** `docs/TESTING.md`
- **Adding space types:** `docs/EXTENSIBILITY.md`
- **CI/CD:** `docs/CI-CD.md`

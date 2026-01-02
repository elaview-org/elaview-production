# /playbook - View Development Playbook

When the user runs `/playbook [phase]`, show the mobile app development checklist.

## Phases

### Phase 1: Setup (Run `/playbook setup`)
- [ ] Project initialized with Expo SDK 54
- [ ] TypeScript configured
- [ ] ESLint + Prettier configured
- [ ] Path aliases set up
- [ ] Folder structure created
- [ ] Apollo Client configured
- [ ] GraphQL Codegen set up

### Phase 2: Auth (Run `/playbook auth`)
- [ ] Login screen
- [ ] Register screen with role selection
- [ ] Forgot password flow
- [ ] Secure token storage
- [ ] Auth state management
- [ ] Protected route wrapper

### Phase 3: Advertiser Flows (Run `/playbook advertiser`)
- [ ] Map-based discovery
- [ ] Space search + filters
- [ ] Space detail screen
- [ ] Booking request flow
- [ ] Creative upload with validation
- [ ] Payment flow (Stripe)
- [ ] Booking management
- [ ] Installation review + approve/dispute

### Phase 4: Owner Flows (Run `/playbook owner`)
- [ ] Listings management
- [ ] Create/edit listing
- [ ] Booking requests
- [ ] File download
- [ ] Verification photo capture (3 photos, GPS)
- [ ] Earnings dashboard

### Phase 5: Polish (Run `/playbook polish`)
- [ ] Empty states
- [ ] Error states
- [ ] Loading states
- [ ] Offline handling
- [ ] Push notifications
- [ ] Accessibility audit

### Phase 6: Testing (Run `/playbook testing`)
- [ ] Unit tests for utils
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E critical paths
- [ ] Coverage requirements met

### Phase 7: Launch (Run `/playbook launch`)
- [ ] App Store assets
- [ ] Play Store assets
- [ ] Privacy policy
- [ ] EAS production build
- [ ] Store submission

See `docs/MOBILE-SCREENS.md` for full screen inventory.

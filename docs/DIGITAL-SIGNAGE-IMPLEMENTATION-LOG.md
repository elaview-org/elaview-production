# Digital Signage — Implementation Log

## Purpose
This file is the running implementation context for the Digital Signage feature so work can resume quickly across sessions without re-discovery.

## Date
March 20, 2026

## Current Architecture Reality (Validated)
- Backend is `.NET 10` with `HotChocolate` GraphQL.
- Database is `PostgreSQL` via `EF Core` (`Npgsql`), not Prisma.
- Entity/config pattern is explicit: `Entity + Config` classes under `backend/Data/Entities`, registered manually in `AppDbContext.OnModelCreating`.
- Booking/payment core entities already exist and are suitable integration points.

## Kickoff Scope (This Session)
1. Add Digital Signage enums to `backend/Data/Entities/Enums.cs`.
2. Add initial schema entities and EF configurations:
   - `DigitalSignageScreen`
   - `DigitalSignageDevice`
   - `DigitalSignageSchedule`
   - `DigitalSignageProofEvent`
3. Register new DbSets and config mappings in `backend/Data/AppDbContext.cs`.
4. Run backend compile check.

## Design Decisions (Kickoff)
- Keep implementation inside existing .NET backend first.
- Follow current EF style (`[Table]`, `IEntityTypeConfiguration`, indexes, defaults).
- Keep the first increment schema-focused; service-layer and GraphQL API follow next.

## Service Layer (Completed — March 20, 2026)
All files under `backend/Features/DigitalSignage/`:

| File | Purpose |
|------|---------|
| `DigitalSignageInputs.cs` | Input records for screen registration, pairing, scheduling, proof events |
| `DigitalSignagePayloads.cs` | Payload wrapper records returned from mutations |
| `DigitalSignageRepository.cs` | `IDigitalSignageRepository` + implementation — CRUD for all 4 entities, ownership helpers |
| `DigitalSignageService.cs` | `IDigitalSignageService` + business logic — validation, pairing code generation, ownership checks |
| `DigitalSignageQueries.cs` | `[QueryType]` — GetMyDigitalSignageScreens, GetDigitalSignageScreenById, schedules, proof events |
| `DigitalSignageMutations.cs` | `[MutationType]` — RegisterScreen, GeneratePairingCode, PairDevice, CreateSchedule, RecordProofEvent |

DI registered in `Bootstrap/Services.cs`:
- `IDigitalSignageService` → `DigitalSignageService`
- `IDigitalSignageRepository` → `DigitalSignageRepository`

### GraphQL Operations Exposed
**Queries:**
- `getMyDigitalSignageScreens` — paged, filtered, sorted (owner-scoped)
- `getDigitalSignageScreenById` — single screen by ID
- `getDigitalSignageSchedulesForScreen` — paged schedules for a screen
- `getDigitalSignageProofEventsForBooking` — paged proof events for a booking

**Mutations:**
- `registerDigitalSignageScreen` — owner registers a screen for their space
- `generateDevicePairingCode` — owner generates 6-digit pairing code (10 min TTL)
- `pairDigitalSignageDevice` — device-side pairing via code + device token
- `createDigitalSignageSchedule` — owner creates content schedule
- `recordDigitalSignageProofEvent` — device reports display proof (no auth — device-token based)

### Build Status
✅ `dotnet build` succeeded (only pre-existing NuGet warnings)

## Next Planned Steps
- Generate EF Core migration: `dotnet ef migrations add AddDigitalSignageSchema`
- Hook booking/payment confirmation to schedule creation event
- Add device heartbeat endpoint
- Frontend: Digital signage management pages for space owners
- Admin dashboard: signage analytics views

## Notes
- This is a living document and should be updated after each implementation milestone.
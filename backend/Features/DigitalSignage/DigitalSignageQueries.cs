using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.DigitalSignage;

[QueryType]
public static partial class DigitalSignageQueries {

    // ── Device Token Lookup (server-to-server, no auth) ──

    /// <summary>
    /// Looks up a device by its token. Used by the signaling service to validate
    /// WebSocket connections. No [Authorize] — this is a server-to-server call.
    /// </summary>
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<DigitalSignageDevice>
        GetDigitalSignageDeviceByToken(
            string token,
            IDigitalSignageRepository repository
        ) => repository.QueryDevices().Where(d => d.DeviceToken == token);

    // ── Screens ──────────────────────────────────────────

    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<DigitalSignageScreen> GetMyDigitalSignageScreens(
        IUserService userService,
        IDigitalSignageService signageService
    ) => signageService.GetScreensByOwner(userService.GetPrincipalId());

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<DigitalSignageScreen> GetDigitalSignageScreenById(
        [ID] Guid id,
        IDigitalSignageService signageService
    ) => signageService.GetScreenById(id);

    // ── Schedules ────────────────────────────────────────

    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<DigitalSignageSchedule>
        GetDigitalSignageSchedulesForScreen(
            [ID] Guid screenId,
            IDigitalSignageService signageService
        ) => signageService.GetSchedulesForScreen(screenId);

    // ── Proof Events ─────────────────────────────────────

    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<DigitalSignageProofEvent>
        GetDigitalSignageProofEventsForBooking(
            [ID] Guid bookingId,
            IDigitalSignageService signageService
        ) => signageService.GetProofEventsForBooking(bookingId);
}

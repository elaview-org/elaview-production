using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class BookingQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Booking> GetBookingById(
        [ID] Guid id,
        IBookingService bookingService
    ) => bookingService.GetById(id);

    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsAdvertiser(
        IUserService userService,
        IBookingService bookingService
    ) => bookingService.GetByAdvertiserUserId(userService.GetPrincipalId());

    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsOwner(
        IUserService userService,
        IBookingService bookingService,
        string? searchText = null
    ) => bookingService.GetByOwnerUserId(userService.GetPrincipalId(), searchText);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Booking> GetIncomingBookingRequests(
        IUserService userService,
        IBookingService bookingService
    ) => bookingService.GetPendingByOwnerUserId(userService.GetPrincipalId());

    [Authorize]
    [UsePaging]
    [UseProjection]
    public static IQueryable<Booking> GetBookingsRequiringAction(
        IUserService userService,
        IBookingService bookingService
    ) => bookingService.GetRequiringActionByUserId(userService.GetPrincipalId());

    [Authorize]
    public static async Task<ExportBookingsPayload> ExportBookingsAsCsv(
        ExportBookingsInput? input,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) => await bookingService.ExportBookingsAsCsvAsync(userService.GetPrincipalId(), input, ct);
}
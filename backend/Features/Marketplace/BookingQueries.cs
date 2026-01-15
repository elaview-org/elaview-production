using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class BookingQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Booking> GetBookingById(
        [ID] Guid id, IBookingService bookingService
    ) => bookingService.GetBookingByIdQuery(id);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsAdvertiser(IBookingService bookingService)
        => bookingService.GetMyBookingsAsAdvertiserQuery();

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsOwner(IBookingService bookingService)
        => bookingService.GetMyBookingsAsOwnerQuery();

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Booking> GetIncomingBookingRequests(IBookingService bookingService)
        => bookingService.GetIncomingBookingRequestsQuery();

    [Authorize]
    [UsePaging]
    [UseProjection]
    public static IQueryable<Booking> GetBookingsRequiringAction(IBookingService bookingService)
        => bookingService.GetBookingsRequiringActionQuery();
}
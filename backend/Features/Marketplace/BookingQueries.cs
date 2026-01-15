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
    ) {
        return bookingService.GetBookingByIdQuery(id);
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsAdvertiser(
        IBookingService bookingService) {
        return bookingService.GetMyBookingsAsAdvertiserQuery();
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetMyBookingsAsOwner(
        IBookingService bookingService) {
        return bookingService.GetMyBookingsAsOwnerQuery();
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Booking> GetIncomingBookingRequests(
        IBookingService bookingService) {
        return bookingService.GetIncomingBookingRequestsQuery();
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    public static IQueryable<Booking> GetBookingsRequiringAction(
        IBookingService bookingService) {
        return bookingService.GetBookingsRequiringActionQuery();
    }
}
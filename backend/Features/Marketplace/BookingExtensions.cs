using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[ExtendObjectType<Booking>]
public static class BookingExtensions {
    [Authorize]
    public static async Task<Campaign?> GetCampaign(
        [Parent] Booking booking, IBookingService bookingService,
        CancellationToken ct
    ) {
        return await bookingService.GetCampaignByBookingIdAsync(booking.Id, ct);
    }

    [Authorize]
    public static async Task<Space?> GetSpace(
        [Parent] Booking booking, IBookingService bookingService,
        CancellationToken ct
    ) {
        return await bookingService.GetSpaceByBookingIdAsync(booking.Id, ct);
    }

    [Authorize]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Review> GetReviews(
        [Parent] Booking booking, IBookingService bookingService
    ) {
        return bookingService.GetReviewsByBookingId(booking.Id);
    }

    [Authorize]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payment> GetPayments(
        [Parent] Booking booking, IBookingService bookingService
    ) {
        return bookingService.GetPaymentsByBookingId(booking.Id);
    }

    [Authorize]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payout> GetPayouts(
        [Parent] Booking booking, IBookingService bookingService
    ) {
        return bookingService.GetPayoutsByBookingId(booking.Id);
    }
}
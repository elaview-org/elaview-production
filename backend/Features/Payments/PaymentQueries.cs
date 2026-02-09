using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
public static partial class PaymentQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Payment> GetPaymentById(
        [ID] Guid id, IPaymentService paymentService
    ) => paymentService.GetById(id);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payment> GetPaymentsByBooking(
        [ID] Guid bookingId, IPaymentService paymentService
    ) => paymentService.GetByBookingId(bookingId);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payment> GetMyPayments(
        IUserService userService,
        IPaymentService paymentService
    ) => paymentService.GetByAdvertiserUserId(userService.GetPrincipalId());

    [Authorize]
    public static async Task<SpendingSummary> GetAdvertiserSpendingSummary(
        IUserService userService,
        IPaymentService paymentService,
        CancellationToken ct
    ) => await paymentService.GetSpendingSummaryAsync(userService.GetPrincipalId(), ct);
}
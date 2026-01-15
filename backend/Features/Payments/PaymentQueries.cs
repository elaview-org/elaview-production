using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class PaymentQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Payment> GetPaymentById(
        [ID] Guid id, IPaymentService paymentService
    ) => paymentService.GetPaymentByIdQuery(id);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payment> GetPaymentsByBooking(
        [ID] Guid bookingId, IPaymentService paymentService
    ) => paymentService.GetPaymentsByBookingIdQuery(bookingId);
}

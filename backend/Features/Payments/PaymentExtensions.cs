using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[ExtendObjectType<Payment>]
public static class PaymentExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Refund> GetRefunds(
        [Parent] Payment payment, IRefundService refundService
    ) => refundService.GetRefundsByPaymentIdQuery(payment.Id);
}

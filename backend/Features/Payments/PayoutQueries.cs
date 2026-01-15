using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class PayoutQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payout> GetMyPayouts(IPayoutService payoutService)
        => payoutService.GetMyPayoutsQuery();

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Payout> GetPayoutById(
        [ID] Guid id, IPayoutService payoutService
    ) => payoutService.GetPayoutByIdQuery(id);

    [Authorize]
    public static async Task<EarningsSummary> GetEarningsSummary(
        IPayoutService payoutService, CancellationToken ct
    ) => await payoutService.GetEarningsSummaryAsync(ct);
}

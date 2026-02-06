using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
public static partial class PayoutQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Payout> GetMyPayouts(
        IUserService userService,
        IPayoutService payoutService
    ) => payoutService.GetByUserId(userService.GetPrincipalId());

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Payout> GetPayoutById(
        [ID] Guid id, IPayoutService payoutService
    ) => payoutService.GetById(id);

    [Authorize]
    public static async Task<EarningsSummary> GetEarningsSummary(
        IUserService userService,
        IPayoutService payoutService,
        CancellationToken ct
    ) => await payoutService.GetEarningsSummaryAsync(userService.GetPrincipalId(), ct);

    [Authorize]
    public static async Task<List<EarningsDataPoint>> GetEarningsByDateRange(
        DateTime start,
        DateTime end,
        Granularity granularity,
        IUserService userService,
        IPayoutService payoutService,
        CancellationToken ct
    ) => await payoutService.GetEarningsByDateRangeAsync(
        userService.GetPrincipalId(), start, end, granularity, ct);
}
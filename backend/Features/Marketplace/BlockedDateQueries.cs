using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class BlockedDateQueries {
    [Authorize]
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<BlockedDate> GetBlockedDatesBySpace(
        [ID] Guid spaceId,
        DateOnly? startDate,
        DateOnly? endDate,
        IBlockedDateService blockedDateService
    ) => blockedDateService.GetBySpaceIdInRange(spaceId, startDate, endDate);
}

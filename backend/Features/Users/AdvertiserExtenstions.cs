using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<AdvertiserProfile>]
public static class AdvertiserExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Campaign> GetCampaigns(
        [Parent] AdvertiserProfile advertiser, AppDbContext context
    ) {
        return context.Campaigns.Where(c =>
            c.AdvertiserProfileId == advertiser.Id);
    }
}
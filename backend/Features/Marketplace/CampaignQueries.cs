using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class CampaignQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Campaign> GetCampaignById(
        [ID] Guid id, ICampaignService campaignService
    ) {
        return campaignService.GetCampaignByIdQuery(id);
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Campaign> GetMyCampaigns(
        ICampaignService campaignService) {
        return campaignService.GetMyCampaignsQuery();
    }
}
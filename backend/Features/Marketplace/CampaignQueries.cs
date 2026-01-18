using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class CampaignQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Campaign> GetCampaignById(
        [ID] Guid id,
        ICampaignService campaignService
    ) => campaignService.GetById(id);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Campaign> GetMyCampaigns(
        IUserService userService,
        ICampaignService campaignService
    ) => campaignService.GetByUserId(userService.GetPrincipalId());
}
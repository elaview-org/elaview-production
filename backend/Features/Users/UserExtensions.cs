using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<User>]
public static class UserExtensions {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<AdvertiserProfile> GetAdvertiserProfile(
        [Parent] User user, AppDbContext context
    ) => context.AdvertiserProfiles.Where(p => p.UserId == user.Id);

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<SpaceOwnerProfile> GetSpaceOwnerProfile(
        [Parent] User user, AppDbContext context
    ) => context.SpaceOwnerProfiles.Where(p => p.UserId == user.Id);
}

[ExtendObjectType<AdvertiserProfile>]
public static class AdvertiserProfileExtensions {
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

[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerProfileExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile spaceOwner, AppDbContext context
    ) {
        return context.Spaces.Where(s =>
            s.SpaceOwnerProfileId == spaceOwner.Id);
    }
}
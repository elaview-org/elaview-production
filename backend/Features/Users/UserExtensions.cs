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
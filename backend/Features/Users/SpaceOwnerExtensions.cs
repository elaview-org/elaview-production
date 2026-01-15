using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile spaceOwner, IUserService userService
    ) {
        return userService.GetSpacesBySpaceOwnerProfileId(spaceOwner.Id);
    }
}
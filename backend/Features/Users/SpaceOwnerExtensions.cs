using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Marketplace;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerExtensions {
    // [Authorize]
    // [UsePaging]
    // [UseProjection]
    // [UseFiltering]
    // [UseSorting]
    // public static IQueryable<Space> GetSpaces(
    //     [Parent] SpaceOwnerProfile spaceOwner, ISpaceService spaceService
    // ) => spaceService.GetByOwnerId(spaceOwner.Id);
}

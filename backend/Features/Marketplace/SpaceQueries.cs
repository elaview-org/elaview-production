using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class SpaceQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Space> GetSpaceById(
        [ID] Guid id,
        ISpaceService spaceService
    ) => spaceService.GetById(id);

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        IUserService userService,
        ISpaceService spaceService
    ) => spaceService.GetAllExcludingUser(userService.GetPrincipalIdOrNull());

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetMySpaces(
        IUserService userService,
        ISpaceService spaceService
    ) => spaceService.GetByUserId(userService.GetPrincipalId());
}
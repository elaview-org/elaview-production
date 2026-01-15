using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class SpaceQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Space> GetSpaceById(
        [ID] Guid id, ISpaceService spaceService
    ) {
        return spaceService.GetSpaceByIdQuery(id);
    }

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(ISpaceService spaceService) {
        return spaceService.GetSpacesExcludingCurrentUserQuery();
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetMySpaces(ISpaceService spaceService) {
        return spaceService.GetMySpacesQuery();
    }
}
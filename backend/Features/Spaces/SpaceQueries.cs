using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ElaviewBackend.Features.Spaces;

[QueryType]
public static partial class SpaceQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Space?> GetSpaceById(
        [ID] string id, AppDbContext context
    ) => context.Spaces.Where(t => t.Id == id);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        AppDbContext context
    ) => context.Spaces;
}
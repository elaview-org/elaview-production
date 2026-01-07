using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ElaviewBackend.GraphQL.Queries;

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
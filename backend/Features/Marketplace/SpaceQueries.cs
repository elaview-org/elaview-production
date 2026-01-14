using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Features.Users;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class SpaceQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Space?> GetSpaceById(
        [ID] Guid id, AppDbContext context
    ) {
        return context.Spaces.Where(t => t.Id == id);
    }

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        AppDbContext context, UserService userService
    ) => userService.PrincipalId() is { } userId
        ? context.Spaces.Where(s =>
            s.SpaceOwnerProfile.UserId.ToString() != userId)
        : context.Spaces;
}
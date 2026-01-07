using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<User>]
public static class UserExtensions {
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetOwnedSpaces(
        [Parent] User user,
        AppDbContext context
    ) => context.Spaces.Where(s => s.OwnerId == user.Id);
}
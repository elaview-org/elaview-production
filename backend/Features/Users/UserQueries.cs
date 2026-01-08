using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[QueryType]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(
        AppDbContext context, UserService userService
    ) {
        return context.Users.Where(t =>
            t.Id.ToString() == userService.PrincipalId());
    }

    [Authorize(Roles = ["Admin"])]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User?> GetUserById(
        [ID] Guid id, AppDbContext context
    ) {
        return context.Users.Where(t => t.Id == id);
    }

    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> GetUsers(
        AppDbContext context
    ) {
        return context.Users;
    }
}
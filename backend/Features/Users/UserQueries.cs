using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[QueryType]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(
        AppDbContext context, IUserService userService
    ) {
        var userId = userService.GetCurrentUserIdOrNull();
        return context.Users.Where(u => u.Id == userId);
    }

    [Authorize(Roles = ["Admin"])]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User?> GetUserById(
        [ID] Guid id, AppDbContext context
    ) {
        return context.Users.Where(u => u.Id == id);
    }

    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> GetUsers(AppDbContext context) {
        return context.Users;
    }
}
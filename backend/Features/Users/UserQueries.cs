using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ElaviewBackend.Features.Users;

[QueryType]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(
        AppDbContext context, UserService userService
    ) => context.Users.Where(t => t.Id == userService.PrincipalId());

    [Authorize(Roles = "Admin")]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User?> GetUserById(
        [ID] string id, AppDbContext context
    ) => context.Users.Where(t => t.Id == id);

    [Authorize(Roles = "Admin")]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> GetUsers(
        AppDbContext context
    ) => context.Users;
}
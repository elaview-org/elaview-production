using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[QueryType]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(IUserService userService)
        => userService.GetCurrentUserQuery();

    [Authorize(Roles = ["Admin"])]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetUserById(
        [ID] Guid id, IUserService userService
    ) => userService.GetUserByIdQuery(id);

    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> GetUsers(IUserService userService)
        => userService.GetUsersQuery();
}
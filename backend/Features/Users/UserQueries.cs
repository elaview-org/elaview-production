using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(IUserService userService) {
        return userService.GetCurrentUser();
    }

    [Authorize(Roles = ["Admin"])]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetUserById(
        [ID] Guid id, IUserService userService
    ) {
        return userService.GetUserById(id);
    }

    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> GetUsers(IUserService userService) {
        return userService.GetAllUsers();
    }
}
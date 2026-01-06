using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using ElaviewBackend.Services;
using Microsoft.AspNetCore.Authorization;

namespace ElaviewBackend.GraphQL.Queries;

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

    [Authorize]
    public static NotificationSettings GetNotificationSettings(
        UserService userService
    ) => new NotificationSettings();

    [Authorize]
    public static SecuritySettings GetSecuritySettings(
        UserService userService
    ) => new SecuritySettings();
}
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using ElaviewBackend.Services;
using GreenDonut.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static partial class UserQueries {
    [Authorize]
    public static async Task<User?> GetCurrentUser(
        AppDbContext dbContext, QueryContext<User> queryContext,
        CancellationToken ct, UserService userService
    ) => await dbContext.Users
        .With(queryContext.Include(t => t.Id))
        .FirstOrDefaultAsync(
            t => t.Id == userService.PrincipalId(), ct
        );

    [Authorize(Roles = "Admin")]
    public static async Task<User?> GetUserById(
        String id, AppDbContext dbContext, QueryContext<User> queryContext,
        CancellationToken ct
    ) => await dbContext.Users
        .With(queryContext.Include(t => t.Id))
        .FirstOrDefaultAsync(t => t.Id == id, ct);

    [Authorize]
    public static NotificationSettings GetNotificationSettings(
        UserService userService
    ) => new NotificationSettings();

    [Authorize]
    public static SecuritySettings GetSecuritySettings(
        UserService userService
    ) => new SecuritySettings();
}
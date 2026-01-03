using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using ElaviewBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static partial class UserQueries {
    // todo: test
    [Authorize]
    public static async Task<User?> GetCurrentUser(
        AppDbContext dbContext, CancellationToken ct, UserService userService
    ) => await dbContext.Users.FirstOrDefaultAsync(
        t => t.Id == userService.PrincipalId(), ct
    );

    // todo: test
    [Authorize(Roles = "Admin")]
    public static async Task<User?> GetUserById(
        String id, AppDbContext dbContext, CancellationToken ct
    ) => await dbContext.Users.FirstOrDefaultAsync(t => t.Id == id, ct);

    [Authorize]
    public static NotificationSettings GetNotificationSettings(
        UserService userService
    ) => new NotificationSettings();

    [Authorize]
    public static SecuritySettings GetSecuritySettings(
        UserService userService
    ) => new SecuritySettings();
}
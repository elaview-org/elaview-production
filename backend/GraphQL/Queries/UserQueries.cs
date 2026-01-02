using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using Microsoft.AspNetCore.Authorization;

namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static partial class UserQueries {
    static string PrincipalId(ClaimsPrincipal principal) =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [Authorize]
    public static async Task<User> GetCurrentUserAsync(
        AppDbContext dbContext, ClaimsPrincipal principal
    ) => await dbContext.Users.FindAsync(
        PrincipalId(principal)
    ) ?? throw new Exception("Not authenticated");

    [Authorize]
    public static NotificationSettings GetNotificationSettings()
        => new NotificationSettings();

    [Authorize]
    public static SecuritySettings GetSecuritySettings()
        => new SecuritySettings();
}
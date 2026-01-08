using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

// todo: admin can delete user
[MutationType]
public static partial class UserMutations {
    [Authorize]
    public static async Task<User> UpdateCurrentUser(
        User updatedUser, AppDbContext dbContext,
        UserService userService, CancellationToken ct
    ) {
        var user = await dbContext.Users
            .FirstAsync(u => u.Id.ToString() == userService.PrincipalId(), ct);
        dbContext.Entry(user).CurrentValues.SetValues(updatedUser);
        await dbContext.SaveChangesAsync(ct);
        return user;
    }
}
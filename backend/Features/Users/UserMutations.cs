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
        CancellationToken ct, UserService userService
    ) {
        var user = await dbContext.Users
            .FirstAsync(u => u.Id == userService.PrincipalId(), ct);
        dbContext.Entry(user).CurrentValues.SetValues(updatedUser);
        user.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct);
        return user;
    }
}
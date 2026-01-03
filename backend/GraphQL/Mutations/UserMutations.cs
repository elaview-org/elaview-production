using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.GraphQL.Mutations;

// [MutationType]
// public static partial class UserMutations {
//     // todo: selected fields to be updated
//     [Authorize]
//     public static async Task<User> UpdateCurrentUser(
//         User updatedUser, AppDbContext dbContext,
//         CancellationToken ct, UserService userService
//     ) {
//         var user = await dbContext.Users
//             .FirstAsync(u => u.Id == userService.PrincipalId(), ct);
//         dbContext.Entry(user).CurrentValues.SetValues(updatedUser);
//         user.UpdatedAt = DateTime.UtcNow;
//         await dbContext.SaveChangesAsync(ct);
//         return user;
//     }
// }
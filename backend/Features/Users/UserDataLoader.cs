using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

internal static class UserDataLoader {
    [DataLoader]
    public static async Task<ILookup<Guid, Space>> GetSpaces(
        IReadOnlyList<Guid> ownerIds, AppDbContext context,
        CancellationToken ct
    ) => (await context.Spaces
        .Where(s => ownerIds.Contains(s.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(s => s.SpaceOwnerProfileId);
}
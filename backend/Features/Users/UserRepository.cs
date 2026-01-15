using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

public interface IUserRepository {
    IQueryable<User> GetUserById(Guid id);
    IQueryable<User> GetAllUsers();
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct);
    Task<User> UpdateAsync(User user, CancellationToken ct);

    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId,
        CancellationToken ct);

    Task<AdvertiserProfile> UpdateAsync(AdvertiserProfile profile,
        CancellationToken ct);

    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId,
        CancellationToken ct);

    Task<SpaceOwnerProfile> UpdateAsync(SpaceOwnerProfile profile,
        CancellationToken ct);

    Task<IReadOnlyList<Payout>> GetPayoutsBySpaceOwnerProfileIdAsync(
        Guid spaceOwnerProfileId, CancellationToken ct);
}

public class UserRepository(
    AppDbContext context,
    IUserByIdDataLoader userById,
    IAdvertiserProfileByUserIdDataLoader advertiserProfileByUserId,
    ISpaceOwnerProfileByUserIdDataLoader spaceOwnerProfileByUserId,
    IPayoutsBySpaceOwnerProfileIdDataLoader payoutsBySpaceOwnerProfileId
) : IUserRepository {
    public IQueryable<User> GetUserById(Guid id)
        => context.Users.Where(u => u.Id == id);

    public IQueryable<User> GetAllUsers() => context.Users;

    public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct)
        => await userById.LoadAsync(id, ct);

    public async Task<User> UpdateAsync(User user, CancellationToken ct) {
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await advertiserProfileByUserId.LoadAsync(userId, ct);

    public async Task<AdvertiserProfile> UpdateAsync(AdvertiserProfile profile,
        CancellationToken ct) {
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await spaceOwnerProfileByUserId.LoadAsync(userId, ct);

    public async Task<SpaceOwnerProfile> UpdateAsync(SpaceOwnerProfile profile,
        CancellationToken ct) {
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<IReadOnlyList<Payout>> GetPayoutsBySpaceOwnerProfileIdAsync(
        Guid spaceOwnerProfileId, CancellationToken ct)
        => await payoutsBySpaceOwnerProfileId.LoadAsync(spaceOwnerProfileId, ct)
           ?? [];
}

internal static class UserDataLoader {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, User>> GetUserById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.Users
        .Where(u => ids.Contains(u.Id))
        .ToDictionaryAsync(u => u.Id, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, AdvertiserProfile>>
        GetAdvertiserProfileByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) => await context.AdvertiserProfiles
        .Where(p => userIds.Contains(p.UserId))
        .ToDictionaryAsync(p => p.UserId, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, SpaceOwnerProfile>>
        GetSpaceOwnerProfileByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) => await context.SpaceOwnerProfiles
        .Where(p => userIds.Contains(p.UserId))
        .ToDictionaryAsync(p => p.UserId, ct);

    [DataLoader]
    public static async Task<ILookup<Guid, Payout>>
        GetPayoutsBySpaceOwnerProfileId(
            IReadOnlyList<Guid> ownerProfileIds, AppDbContext context,
            CancellationToken ct
        ) => (await context.Payouts
        .Where(p => ownerProfileIds.Contains(p.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(p => p.SpaceOwnerProfileId);
}

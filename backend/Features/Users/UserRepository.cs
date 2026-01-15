using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

public interface IUserRepository {
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId,
        CancellationToken cancellationToken);

    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<Space>> GetSpacesBySpaceOwnerProfileIdAsync(
        Guid spaceOwnerProfileId, CancellationToken cancellationToken);

    Task<IReadOnlyList<Campaign>> GetCampaignsByAdvertiserProfileIdAsync(
        Guid advertiserProfileId, CancellationToken cancellationToken);

    Task<IReadOnlyList<Payout>> GetPayoutsBySpaceOwnerProfileIdAsync(
        Guid spaceOwnerProfileId, CancellationToken cancellationToken);
}

public class UserRepository(
    IUserByIdDataLoader userById,
    IAdvertiserProfileByUserIdDataLoader advertiserProfileByUserId,
    ISpaceOwnerProfileByUserIdDataLoader spaceOwnerProfileByUserId,
    ISpacesBySpaceOwnerProfileIdDataLoader spacesBySpaceOwnerProfileId,
    ICampaignsByAdvertiserProfileIdDataLoader
        campaignsByAdvertiserProfileId,
    IPayoutsBySpaceOwnerProfileIdDataLoader payoutsBySpaceOwnerProfileId
) : IUserRepository {
    public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct)
        => await userById.LoadAsync(id, ct);

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await advertiserProfileByUserId.LoadAsync(userId, ct);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await spaceOwnerProfileByUserId.LoadAsync(userId, ct);

    public async Task<IReadOnlyList<Space>> GetSpacesBySpaceOwnerProfileIdAsync(
        Guid spaceOwnerProfileId, CancellationToken ct)
        => await spacesBySpaceOwnerProfileId.LoadAsync(spaceOwnerProfileId,
            ct) ?? [];

    public async Task<IReadOnlyList<Campaign>>
        GetCampaignsByAdvertiserProfileIdAsync(
            Guid advertiserProfileId, CancellationToken ct)
        => await campaignsByAdvertiserProfileId.LoadAsync(advertiserProfileId,
            ct) ?? [];

    public async Task<IReadOnlyList<Payout>>
        GetPayoutsBySpaceOwnerProfileIdAsync(
            Guid spaceOwnerProfileId, CancellationToken ct)
        => await payoutsBySpaceOwnerProfileId.LoadAsync(spaceOwnerProfileId,
            ct) ?? [];
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
    public static async Task<ILookup<Guid, Space>>
        GetSpacesBySpaceOwnerProfileId(
            IReadOnlyList<Guid> ownerProfileIds, AppDbContext context,
            CancellationToken ct
        ) => (await context.Spaces
        .Where(s => ownerProfileIds.Contains(s.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(s => s.SpaceOwnerProfileId);

    [DataLoader]
    public static async Task<ILookup<Guid, Campaign>>
        GetCampaignsByAdvertiserProfileId(
            IReadOnlyList<Guid> advertiserProfileIds, AppDbContext context,
            CancellationToken ct
        ) => (await context.Campaigns
        .Where(c => advertiserProfileIds.Contains(c.AdvertiserProfileId))
        .ToListAsync(ct)).ToLookup(c => c.AdvertiserProfileId);

    [DataLoader]
    public static async Task<ILookup<Guid, Payout>>
        GetPayoutsBySpaceOwnerProfileId(
            IReadOnlyList<Guid> ownerProfileIds, AppDbContext context,
            CancellationToken ct
        ) => (await context.Payouts
        .Where(p => ownerProfileIds.Contains(p.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(p => p.SpaceOwnerProfileId);
}
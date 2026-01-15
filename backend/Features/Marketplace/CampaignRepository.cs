using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ICampaignRepository {
    Task<Campaign?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId,
        CancellationToken ct);

    Task<IReadOnlyList<Booking>> GetBookingsByCampaignIdAsync(Guid campaignId,
        CancellationToken ct);
}

public sealed class CampaignRepository(
    ICampaignByIdDataLoader campaignById,
    IAdvertiserByCampaignIdDataLoader advertiserByCampaignId,
    IBookingsByCampaignIdDataLoader bookingsByCampaignId
) : ICampaignRepository {
    public async Task<Campaign?> GetByIdAsync(Guid id, CancellationToken ct) {
        return await campaignById.LoadAsync(id, ct);
    }

    public async Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(
        Guid campaignId, CancellationToken ct) {
        return await advertiserByCampaignId.LoadAsync(campaignId, ct);
    }

    public async Task<IReadOnlyList<Booking>> GetBookingsByCampaignIdAsync(
        Guid campaignId, CancellationToken ct) {
        return await bookingsByCampaignId.LoadAsync(campaignId, ct) ?? [];
    }
}

internal static class CampaignDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Campaign>>
        GetCampaignById(
            IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
        ) {
        return await context.Campaigns
            .Where(c => ids.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, AdvertiserProfile>>
        GetAdvertiserByCampaignId(
            IReadOnlyList<Guid> campaignIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Campaigns
            .Where(c => campaignIds.Contains(c.Id))
            .Include(c => c.AdvertiserProfile)
            .ToDictionaryAsync(c => c.Id, c => c.AdvertiserProfile, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Booking>> GetBookingsByCampaignId(
        IReadOnlyList<Guid> campaignIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Bookings
            .Where(b => campaignIds.Contains(b.CampaignId))
            .ToListAsync(ct)).ToLookup(b => b.CampaignId);
    }
}
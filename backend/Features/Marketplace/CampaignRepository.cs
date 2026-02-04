using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ICampaignRepository {
    IQueryable<Campaign> Query();
    Task<Campaign?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Campaign?> GetByIdWithOwnerAsync(Guid id, CancellationToken ct);
    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId, CancellationToken ct);
    Task<bool> HasActiveBookingsAsync(Guid campaignId, CancellationToken ct);
    IQueryable<Campaign> GetByAdvertiserId(Guid advertiserId);
    IQueryable<Campaign> GetByUserId(Guid userId);
    IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId);
    Task<Campaign> AddAsync(Campaign campaign, CancellationToken ct);
    Task<Campaign> UpdateAsync(Campaign campaign, UpdateCampaignInput input, CancellationToken ct);
    Task<Campaign> UpdateStatusAsync(Campaign campaign, CampaignStatus status, CancellationToken ct);
    Task<bool> DeleteAsync(Campaign campaign, CancellationToken ct);
}

public sealed class CampaignRepository(
    AppDbContext context,
    ICampaignByIdDataLoader campaignById,
    IAdvertiserByCampaignIdDataLoader advertiserByCampaignId
) : ICampaignRepository {
    public IQueryable<Campaign> Query() => context.Campaigns;

    public async Task<Campaign?> GetByIdAsync(Guid id, CancellationToken ct)
        => await campaignById.LoadAsync(id, ct);

    public async Task<Campaign?> GetByIdWithOwnerAsync(Guid id, CancellationToken ct)
        => await context.Campaigns
            .Include(c => c.AdvertiserProfile)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.AdvertiserProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId, CancellationToken ct)
        => await advertiserByCampaignId.LoadAsync(campaignId, ct);

    public async Task<bool> HasActiveBookingsAsync(Guid campaignId, CancellationToken ct)
        => await context.Bookings.AnyAsync(b =>
            b.CampaignId == campaignId &&
            b.Status != BookingStatus.Completed &&
            b.Status != BookingStatus.Cancelled &&
            b.Status != BookingStatus.Rejected, ct);

    public IQueryable<Campaign> GetByAdvertiserId(Guid advertiserId)
        => context.Campaigns
            .Where(c => c.AdvertiserProfileId == advertiserId)
            .OrderByDescending(c => c.CreatedAt);

    public IQueryable<Campaign> GetByUserId(Guid userId)
        => context.Campaigns
            .Where(c => c.AdvertiserProfile.UserId == userId)
            .OrderByDescending(c => c.CreatedAt);

    public IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId)
        => context.Bookings.Where(b => b.CampaignId == campaignId);

    public async Task<Campaign> AddAsync(Campaign campaign, CancellationToken ct) {
        context.Campaigns.Add(campaign);
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public async Task<Campaign> UpdateAsync(Campaign campaign, UpdateCampaignInput input, CancellationToken ct) {
        var entry = context.Entry(campaign);
        if (input.Name is not null)
            entry.Property(c => c.Name).CurrentValue = input.Name;
        if (input.Description is not null)
            entry.Property(c => c.Description).CurrentValue = input.Description;
        if (input.ImageUrl is not null)
            entry.Property(c => c.ImageUrl).CurrentValue = input.ImageUrl;
        if (input.TargetAudience is not null)
            entry.Property(c => c.TargetAudience).CurrentValue = input.TargetAudience;
        if (input.Goals is not null)
            entry.Property(c => c.Goals).CurrentValue = input.Goals;
        if (input.TotalBudget is not null)
            entry.Property(c => c.TotalBudget).CurrentValue = input.TotalBudget;
        if (input.StartDate is not null)
            entry.Property(c => c.StartDate).CurrentValue = input.StartDate;
        if (input.EndDate is not null)
            entry.Property(c => c.EndDate).CurrentValue = input.EndDate;
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public async Task<Campaign> UpdateStatusAsync(Campaign campaign, CampaignStatus status, CancellationToken ct) {
        context.Entry(campaign).Property(c => c.Status).CurrentValue = status;
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public async Task<bool> DeleteAsync(Campaign campaign, CancellationToken ct) {
        context.Campaigns.Remove(campaign);
        await context.SaveChangesAsync(ct);
        return true;
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

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, decimal>>
        GetTotalSpendByCampaignId(
            IReadOnlyList<Guid> campaignIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Payments
            .Where(p => campaignIds.Contains(p.Booking.CampaignId) &&
                        p.Status == PaymentStatus.Succeeded)
            .GroupBy(p => p.Booking.CampaignId)
            .Select(g => new { CampaignId = g.Key, Total = g.Sum(p => p.Amount) })
            .ToDictionaryAsync(g => g.CampaignId, g => g.Total, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, int>>
        GetSpacesCountByCampaignId(
            IReadOnlyList<Guid> campaignIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Bookings
            .Where(b => campaignIds.Contains(b.CampaignId))
            .GroupBy(b => b.CampaignId)
            .Select(g => new {
                CampaignId = g.Key,
                Count = g.Select(b => b.SpaceId).Distinct().Count()
            })
            .ToDictionaryAsync(g => g.CampaignId, g => g.Count, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, decimal>>
        GetTotalSpendByAdvertiserId(
            IReadOnlyList<Guid> advertiserIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Payments
            .Where(p =>
                advertiserIds.Contains(p.Booking.Campaign.AdvertiserProfileId) &&
                p.Status == PaymentStatus.Succeeded)
            .GroupBy(p => p.Booking.Campaign.AdvertiserProfileId)
            .Select(g => new { AdvertiserId = g.Key, Total = g.Sum(p => p.Amount) })
            .ToDictionaryAsync(g => g.AdvertiserId, g => g.Total, ct);
    }
}
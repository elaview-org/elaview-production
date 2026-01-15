using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ICampaignService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Campaign> GetCampaignByIdQuery(Guid id);
    IQueryable<Campaign> GetMyCampaignsQuery();
    Task<Campaign?> GetCampaignByIdAsync(Guid id, CancellationToken ct);
    Task<Campaign> CreateAsync(CreateCampaignInput input, CancellationToken ct);

    Task<Campaign> UpdateAsync(Guid id, UpdateCampaignInput input,
        CancellationToken ct);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
    Task<Campaign> SubmitAsync(Guid id, CancellationToken ct);
    Task<Campaign> CancelAsync(Guid id, CancellationToken ct);
    IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId);

    Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId,
        CancellationToken ct);
}

public sealed class CampaignService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    ICampaignRepository campaignRepository
) : ICampaignService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    public IQueryable<Campaign> GetCampaignByIdQuery(Guid id) {
        return context.Campaigns.Where(c => c.Id == id);
    }

    public IQueryable<Campaign> GetMyCampaignsQuery() {
        var userId = GetCurrentUserId();
        return context.Campaigns.Where(c =>
            c.AdvertiserProfile.UserId == userId);
    }

    public async Task<Campaign?> GetCampaignByIdAsync(Guid id,
        CancellationToken ct) {
        return await campaignRepository.GetByIdAsync(id, ct);
    }

    public async Task<Campaign> CreateAsync(CreateCampaignInput input,
        CancellationToken ct) {
        var userId = GetCurrentUserId();
        var profile = await context.AdvertiserProfiles
                          .Where(p => p.UserId == userId)
                          .Select(p => new { p.Id })
                          .FirstOrDefaultAsync(ct)
                      ?? throw new GraphQLException(
                          "Advertiser profile not found");

        var campaign = new Campaign {
            AdvertiserProfileId = profile.Id,
            Name = input.Name,
            Description = input.Description,
            ImageUrl = input.ImageUrl,
            TargetAudience = input.TargetAudience,
            Goals = input.Goals,
            TotalBudget = input.TotalBudget,
            Status = CampaignStatus.Draft,
            StartDate = input.StartDate,
            EndDate = input.EndDate,
            CreatedAt = DateTime.UtcNow
        };

        context.Campaigns.Add(campaign);
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public async Task<Campaign> UpdateAsync(Guid id, UpdateCampaignInput input,
        CancellationToken ct) {
        var userId = GetCurrentUserId();
        var campaign = await context.Campaigns
                           .FirstOrDefaultAsync(
                               c => c.Id == id && c.AdvertiserProfile.UserId ==
                                   userId, ct)
                       ?? throw new GraphQLException("Campaign not found");

        if (campaign.Status != CampaignStatus.Draft &&
            campaign.Status != CampaignStatus.Submitted)
            throw new GraphQLException(
                "Cannot update campaign in current status");

        var entry = context.Entry(campaign);
        if (input.Name is not null)
            entry.Property(c => c.Name).CurrentValue = input.Name;
        if (input.Description is not null)
            entry.Property(c => c.Description).CurrentValue = input.Description;
        if (input.ImageUrl is not null)
            entry.Property(c => c.ImageUrl).CurrentValue = input.ImageUrl;
        if (input.TargetAudience is not null)
            entry.Property(c => c.TargetAudience).CurrentValue =
                input.TargetAudience;
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

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var campaign = await context.Campaigns
            .FirstOrDefaultAsync(
                c => c.Id == id && c.AdvertiserProfile.UserId == userId, ct);

        if (campaign is null) return false;

        var hasActiveBookings = await context.Bookings
            .AnyAsync(b => b.CampaignId == id &&
                           b.Status != BookingStatus.Completed &&
                           b.Status != BookingStatus.Cancelled &&
                           b.Status != BookingStatus.Rejected, ct);

        if (hasActiveBookings)
            throw new GraphQLException(
                "Cannot delete campaign with active bookings");

        context.Campaigns.Remove(campaign);
        await context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<Campaign> SubmitAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var campaign = await context.Campaigns
                           .FirstOrDefaultAsync(
                               c => c.Id == id && c.AdvertiserProfile.UserId ==
                                   userId, ct)
                       ?? throw new GraphQLException("Campaign not found");

        if (campaign.Status != CampaignStatus.Draft)
            throw new GraphQLException("Only draft campaigns can be submitted");

        context.Entry(campaign).Property(c => c.Status).CurrentValue =
            CampaignStatus.Submitted;
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public async Task<Campaign> CancelAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var campaign = await context.Campaigns
                           .FirstOrDefaultAsync(
                               c => c.Id == id && c.AdvertiserProfile.UserId ==
                                   userId, ct)
                       ?? throw new GraphQLException("Campaign not found");

        context.Entry(campaign).Property(c => c.Status).CurrentValue =
            CampaignStatus.Cancelled;
        await context.SaveChangesAsync(ct);
        return campaign;
    }

    public IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId) {
        return context.Bookings.Where(b => b.CampaignId == campaignId);
    }

    public async Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(
        Guid campaignId, CancellationToken ct) {
        return await campaignRepository.GetAdvertiserByCampaignIdAsync(
            campaignId, ct);
    }

    private Guid GetCurrentUserId() {
        return GetCurrentUserIdOrNull() ??
               throw new GraphQLException("Not authenticated");
    }
}
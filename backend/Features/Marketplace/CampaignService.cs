using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface ICampaignService {
    IQueryable<Campaign> GetById(Guid id);
    IQueryable<Campaign> GetByUserId(Guid userId);
    IQueryable<Campaign> GetByAdvertiserId(Guid advertiserProfileId);
    IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId);
    Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId, CancellationToken ct);
    Task<Campaign> CreateAsync(Guid userId, CreateCampaignInput input, CancellationToken ct);
    Task<Campaign> UpdateAsync(Guid userId, Guid id, UpdateCampaignInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Campaign> SubmitAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Campaign> CancelAsync(Guid userId, Guid id, CancellationToken ct);
}

public sealed class CampaignService(ICampaignRepository repository) : ICampaignService {
    public IQueryable<Campaign> GetById(Guid id)
        => repository.Query().Where(c => c.Id == id);

    public IQueryable<Campaign> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public IQueryable<Campaign> GetByAdvertiserId(Guid advertiserId)
        => repository.GetByAdvertiserId(advertiserId);

    public IQueryable<Booking> GetBookingsByCampaignId(Guid campaignId)
        => repository.GetBookingsByCampaignId(campaignId);

    public async Task<AdvertiserProfile?> GetAdvertiserByCampaignIdAsync(Guid campaignId, CancellationToken ct)
        => await repository.GetAdvertiserByCampaignIdAsync(campaignId, ct);

    public async Task<Campaign> CreateAsync(Guid userId, CreateCampaignInput input, CancellationToken ct) {
        var profile = await repository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);

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

        return await repository.AddAsync(campaign, ct);
    }

    public async Task<Campaign> UpdateAsync(Guid userId, Guid id, UpdateCampaignInput input, CancellationToken ct) {
        var campaign = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Campaign", id);

        if (campaign.AdvertiserProfile.UserId != userId)
            throw new ForbiddenException("update this campaign");

        if (campaign.Status != CampaignStatus.Draft && campaign.Status != CampaignStatus.Submitted)
            throw new InvalidStatusTransitionException(campaign.Status.ToString(), "Updated");

        return await repository.UpdateAsync(campaign, input, ct);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct) {
        var campaign = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Campaign", id);

        if (campaign.AdvertiserProfile.UserId != userId)
            throw new ForbiddenException("delete this campaign");

        if (await repository.HasActiveBookingsAsync(id, ct))
            throw new ConflictException("Campaign", "Cannot delete campaign with active bookings");

        return await repository.DeleteAsync(campaign, ct);
    }

    public async Task<Campaign> SubmitAsync(Guid userId, Guid id, CancellationToken ct) {
        var campaign = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Campaign", id);

        if (campaign.AdvertiserProfile.UserId != userId)
            throw new ForbiddenException("submit this campaign");

        if (campaign.Status != CampaignStatus.Draft)
            throw new InvalidStatusTransitionException(campaign.Status.ToString(), CampaignStatus.Submitted.ToString());

        return await repository.UpdateStatusAsync(campaign, CampaignStatus.Submitted, ct);
    }

    public async Task<Campaign> CancelAsync(Guid userId, Guid id, CancellationToken ct) {
        var campaign = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Campaign", id);

        if (campaign.AdvertiserProfile.UserId != userId)
            throw new ForbiddenException("cancel this campaign");

        return await repository.UpdateStatusAsync(campaign, CampaignStatus.Cancelled, ct);
    }
}
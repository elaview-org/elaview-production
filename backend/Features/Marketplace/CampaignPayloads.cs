using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateCampaignPayload(Campaign Campaign);
public record UpdateCampaignPayload(Campaign Campaign);
public record DeleteCampaignPayload(bool Success);
public record SubmitCampaignPayload(Campaign Campaign);
public record CancelCampaignPayload(Campaign Campaign);
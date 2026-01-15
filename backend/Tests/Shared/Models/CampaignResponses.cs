namespace ElaviewBackend.Tests.Shared.Models;

public record CampaignsResponse(CampaignsConnection Campaigns);

public record CampaignsConnection(List<CampaignNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record CampaignNode(
    Guid Id,
    string Name,
    string? Description,
    string ImageUrl,
    string Status
);

public record CampaignByIdResponse(CampaignNode? CampaignById);

public record MyCampaignsResponse(CampaignsConnection MyCampaigns);

public record CreateCampaignResponse(CreateCampaignPayload CreateCampaign);

public record CreateCampaignPayload(CampaignNode Campaign);

public record UpdateCampaignResponse(UpdateCampaignPayload UpdateCampaign);

public record UpdateCampaignPayload(CampaignNode Campaign);

public record DeleteCampaignResponse(DeleteCampaignPayload DeleteCampaign);

public record DeleteCampaignPayload(bool Success);
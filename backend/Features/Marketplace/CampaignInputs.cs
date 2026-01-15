namespace ElaviewBackend.Features.Marketplace;

public record CreateCampaignInput(
    string Name,
    string? Description,
    string ImageUrl,
    string? TargetAudience,
    string? Goals,
    decimal? TotalBudget,
    DateTime? StartDate,
    DateTime? EndDate
);

public record UpdateCampaignInput(
    string? Name,
    string? Description,
    string? ImageUrl,
    string? TargetAudience,
    string? Goals,
    decimal? TotalBudget,
    DateTime? StartDate,
    DateTime? EndDate
);
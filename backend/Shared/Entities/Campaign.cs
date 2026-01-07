using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class Campaign {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    [MaxLength(500)]
    public string Name { get; init; } = null!;

    [MaxLength(500)]
    public string? Description { get; init; }

    [MaxLength(1000)]
    public string ImageUrl { get; init; } = null!;

    [MaxLength(50)]
    public string? TargetAudience { get; init; }

    [MaxLength(50)]
    public string? Goals { get; init; }

    public decimal? TotalBudget { get; init; }

    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }

    public Profile AdvertiserProfile { get; init; } = null!;
}
using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class MarketResearch
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(255)]
    public string CompanyName { get; init; } = null!;
    public BusinessType BusinessType { get; init; } = BusinessType.Other;
    [MaxLength(500)]
    public string? Website { get; init; }
    [MaxLength(255)]
    public string? Location { get; init; }
    public TriState HasInventory { get; set; } = TriState.Unknown;
    public TriState HasInstallCapability { get; set; } = TriState.Unknown;
    public Scale EstimatedScale { get; set; } = Scale.UnknownScale;
    public string? ReasonNotPursuing { get; init; }
    public DateTime? RevisitDate { get; set; }
    public string? Notes { get; init; }
    [MaxLength(500)]
    public string? SourceUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data;

public sealed class MarketResearch
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(255)]
    public string CompanyName { get; init; } = null!;
    public BusinessType BusinessType { get; init; } = BusinessType.OTHER;
    [MaxLength(500)]
    public string? Website { get; init; }
    [MaxLength(255)]
    public string? Location { get; init; }
    public TriState HasInventory { get; set; } = TriState.UNKNOWN;
    public TriState HasInstallCapability { get; set; } = TriState.UNKNOWN;
    public Scale EstimatedScale { get; set; } = Scale.UNKNOWN_SCALE;
    public string? ReasonNotPursuing { get; init; }
    public DateTime? RevisitDate { get; set; }
    public string? Notes { get; init; }
    [MaxLength(500)]
    public string? SourceUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
}

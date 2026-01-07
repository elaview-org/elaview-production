using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class ReferralPartner
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(255)]
    public string Name { get; init; } = null!;
    [MaxLength(255)]
    public string? Company { get; init; }
    [MaxLength(255)]
    public string? Email { get; init; }
    [MaxLength(50)]
    public string? Phone { get; init; }
    [MaxLength(100)]
    public string? PartnerType { get; init; }
    public PartnerStatus Status { get; set; } = PartnerStatus.Prospect;
    public int LeadsReferred { get; set; } = 0;
    public int LeadsConverted { get; set; } = 0;
    public decimal TotalRevenue { get; set; } = 0;
    public decimal? CommissionRate { get; init; }
    public string? Notes { get; init; }
    public DateTime? LastContactDate { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
}

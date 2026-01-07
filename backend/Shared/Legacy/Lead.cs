using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Legacy;

public sealed class Lead {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    [MaxLength(255)]
    public string Name { get; init; } = null!;

    [MaxLength(255)]
    public string? Email { get; init; }

    [MaxLength(255)]
    public string? Company { get; init; }

    [MaxLength(50)]
    public string? Phone { get; init; }

    [MaxLength(500)]
    public string? Website { get; init; }

    public LeadSource Source { get; init; } = LeadSource.GoogleMaps;

    public BusinessType BusinessType { get; init; } = BusinessType.Other;

    [MaxLength(255)]
    public string? Location { get; init; }

    public TriState HasInventory { get; set; } = TriState.Unknown;

    public SpaceType? InventoryType { get; set; }

    public int? EstimatedSpaces { get; set; }

    public TriState HasInstallCapability { get; set; } = TriState.Unknown;

    public bool Phase1Qualified { get; set; } = false;

    public int PriorityScore { get; set; } = 1;

    public LeadStatus Status { get; set; } = LeadStatus.New;

    public DateTime? LastContactDate { get; set; }

    [MaxLength(500)]
    public string? NextAction { get; set; }

    public DateTime? NextFollowUpDate { get; set; }

    public DateTime? ConvertedAt { get; set; }

    [MaxLength(50)]
    public string? ConvertedUserId { get; init; }

    public int SpacesListed { get; set; }

    public DateTime? FirstBookingDate { get; set; }

    public decimal TotalRevenue { get; set; }

    [MaxLength(255)]
    public string? ConversionSource { get; init; }

    public bool TestimonialGiven { get; set; }

    public bool WillingToRefer { get; set; }

    [MaxLength(2000)]
    public string? ReferralNotes { get; init; }

    [MaxLength(2000)]
    public string? Notes { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }

    [GraphQLIgnore]
    public ICollection<OutreachLog> Outreach { get; init; } =
        new List<OutreachLog>();
}
using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Legacy;

public sealed class PlatformAnalytics {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    public DateOnly Date { get; init; }

    public int NewUsers { get; set; } = 0;

    public int NewSpaces { get; set; } = 0;

    public int NewCampaigns { get; set; } = 0;

    public int NewBookings { get; set; } = 0;

    public decimal TotalRevenue { get; set; } = 0;

    public decimal PlatformFees { get; set; } = 0;

    public DateTime CreatedAt { get; init; }
}
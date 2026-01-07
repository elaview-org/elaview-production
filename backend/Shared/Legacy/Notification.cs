using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Legacy;

public sealed class Notification {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    public NotificationType Type { get; init; }

    [MaxLength(500)]
    public string Title { get; init; } = null!;

    [MaxLength(2000)]
    public string Content { get; init; } = null!;

    public bool IsRead { get; set; } = false;

    [MaxLength(50)]
    public string? CampaignId { get; init; }

    [MaxLength(50)]
    public string? BookingId { get; init; }

    public DateTime CreatedAt { get; init; }

    public User User { get; init; } = null!;
}
using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data;

public sealed class Notification {
    [MaxLength(50)] public string Id { get; init; } = null!;
    [MaxLength(50)] public string UserId { get; init; } = null!;
    public NotificationType Type { get; init; }
    [MaxLength(500)] public string Title { get; init; } = null!;
    public string Content { get; init; } = null!;
    public bool IsRead { get; set; } = false;
    [MaxLength(50)] public string? CampaignId { get; init; }
    [MaxLength(50)] public string? BookingId { get; init; }
    public DateTime CreatedAt { get; init; }
    public User User { get; init; } = null!;
}
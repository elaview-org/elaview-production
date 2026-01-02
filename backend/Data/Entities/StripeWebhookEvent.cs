using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class StripeWebhookEvent
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(255)]
    public string StripeEventId { get; init; } = null!;
    public bool Processed { get; set; } = false;
    public DateTime? ProcessedAt { get; set; }
    public DateTime CreatedAt { get; init; }
}

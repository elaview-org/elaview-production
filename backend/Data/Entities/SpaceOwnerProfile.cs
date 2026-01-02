using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class SpaceOwnerProfile
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(50)]
    public string UserId { get; init; } = null!;
    [MaxLength(255)]
    public string? BusinessName { get; init; }
    [MaxLength(255)]
    public string? BusinessType { get; init; }
    [MaxLength(255)]
    public string? StripeAccountId { get; init; }
    public PayoutSchedule PayoutSchedule { get; init; } = PayoutSchedule.Weekly;
    public bool OnboardingComplete { get; set; } = false;
    [MaxLength(50)]
    public string? StripeAccountStatus { get; init; } = "PENDING";
    public DateTime? LastAccountHealthCheck { get; set; }
    public DateTime? AccountDisconnectedAt { get; set; }
    public DateTime? AccountDisconnectedNotifiedAt { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public User User { get; init; } = null!;
}
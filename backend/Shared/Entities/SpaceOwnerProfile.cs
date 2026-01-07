using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class SpaceOwnerProfile {
    public Profile Profile { get; init; } = null!;

    [MaxLength(255)]
    public string? BusinessName { get; init; }

    [MaxLength(255)]
    public string? BusinessType { get; init; }

    [MaxLength(255)]
    public string? StripeAccountId { get; init; }

    [MaxLength(50)]
    public string? StripeAccountStatus { get; init; }

    public DateTime? StripeLastAccountHealthCheck { get; set; }

    public DateTime? StripeAccountDisconnectedAt { get; set; }

    public DateTime? StripeAccountDisconnectedNotifiedAt { get; set; }

    public PayoutSchedule PayoutSchedule { get; init; } = PayoutSchedule.Weekly;

    public bool OnboardingComplete { get; set; } = false;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }
}
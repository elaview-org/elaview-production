using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class AdvertiserProfile {
    public Profile Profile { get; init; } = null!;

    [MaxLength(255)]
    public string? CompanyName { get; init; }

    [MaxLength(255)]
    public string? Industry { get; init; }

    [MaxLength(500)]
    public string? Website { get; init; }

    [MaxLength(255)]
    public string? StripeCustomerId { get; init; }

    [MaxLength(50)]
    public string? StripeAccountStatus { get; init; }

    public DateTime? StripeLastAccountHealthCheck { get; set; }

    public DateTime? StripeAccountDisconnectedAt { get; set; }

    public DateTime? StripeAccountDisconnectedNotifiedAt { get; set; }

    public bool OnboardingComplete { get; set; } = false;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public abstract class TimestampBase {
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
}

public abstract class EntityBase : TimestampBase {
    [MaxLength(50)]
    [IsProjected(true)]
    public string? Id { get; init; }
}

public abstract class UserProfileBase : TimestampBase {
    public Profile Profile { get; init; } = null!;

    public bool OnboardingComplete { get; set; } = false;

    [MaxLength(255)]
    public string? StripeAccountId { get; set; }

    [MaxLength(50)]
    public string? StripeAccountStatus { get; set; }

    public DateTime? StripeLastAccountHealthCheck { get; set; }

    public DateTime? StripeAccountDisconnectedAt { get; set; }

    public DateTime? StripeAccountDisconnectedNotifiedAt { get; set; }
}
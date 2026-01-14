using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public abstract class EntityBase {
    [IsProjected]
    public Guid Id { get; init; }

    public DateTime CreatedAt { get; init; }
}

public abstract class UserProfileBase : EntityBase {
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public bool OnboardingComplete { get; set; } = false;

    [MaxLength(255)]
    public string? StripeAccountId { get; set; }

    [MaxLength(50)]
    public string? StripeAccountStatus { get; set; }

    public DateTime? StripeLastAccountHealthCheck { get; set; }

    public DateTime? StripeAccountDisconnectedAt { get; set; }

    public DateTime? StripeAccountDisconnectedNotifiedAt { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class SpaceOwnerProfile : UserProfileBase {
    [MaxLength(255)]
    public string? BusinessName { get; init; }

    [MaxLength(255)]
    public string? BusinessType { get; init; }

    public PayoutSchedule PayoutSchedule { get; init; } = PayoutSchedule.Weekly;
}
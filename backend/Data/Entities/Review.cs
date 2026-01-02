using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class Review
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(50)]
    public string BookingId { get; init; } = null!;
    [MaxLength(50)]
    public string SpaceId { get; init; } = null!;
    public int Rating { get; init; }
    public string? Comment { get; init; }
    public ReviewerType ReviewerType { get; init; }
    public DateTime CreatedAt { get; init; }
    public Booking Booking { get; init; } = null!;
    public Space Space { get; init; } = null!;
}

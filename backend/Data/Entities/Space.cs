using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class Space {
    [MaxLength(50)] public string Id { get; init; } = null!;
    [MaxLength(50)] public string OwnerId { get; init; } = null!;
    [MaxLength(500)] public string Title { get; init; } = null!;
    [MaxLength(500)] public string? Description { get; init; }
    public SpaceType Type { get; init; }
    public SpaceStatus Status { get; init; } = SpaceStatus.Active;
    [MaxLength(500)] public string Address { get; init; } = null!;
    [MaxLength(100)] public string City { get; init; } = null!;
    [MaxLength(100)] public string State { get; init; } = null!;
    [MaxLength(20)] public string? ZipCode { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public double? Width { get; init; }
    public double? Height { get; init; }
    [MaxLength(100)] public string? Dimensions { get; init; }
    public decimal PricePerDay { get; init; }
    public decimal? InstallationFee { get; init; }
    public int MinDuration { get; init; } = 1;
    public int? MaxDuration { get; init; }
    public List<string> Images { get; init; } = new();
    public DateTime? AvailableFrom { get; init; }
    public DateTime? AvailableTo { get; init; }
    public int TotalBookings { get; set; } = 0;
    public decimal TotalRevenue { get; set; } = 0;
    public double? AverageRating { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    [MaxLength(100)] public string? DimensionsText { get; init; }
    [MaxLength(500)] public string? RejectionReason { get; init; }
    [MaxLength(500)] public string? Traffic { get; init; }
    [MaxLength(20)] public string? QuadtreeNodeId { get; init; }
    public int? QuadtreeDepth { get; init; }
    public User Owner { get; init; } = null!;
    public ICollection<Booking> Bookings { get; init; } = new List<Booking>();
    public ICollection<Review> Reviews { get; init; } = new List<Review>();
}
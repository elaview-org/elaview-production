using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class User {
    [MaxLength(50)] public string? Id { get; init; }
    [MaxLength(255)] public string Email { get; init; } = null!;
    [MaxLength(500)] public string Password { get; init; } = null!;
    [MaxLength(255)] public string? Name { get; init; }
    [MaxLength(50)] public string? Phone { get; init; }
    [MaxLength(500)] public string? Avatar { get; init; }
    public UserRole Role { get; init; } = UserRole.Advertiser;
    public UserStatus Status { get; init; } = UserStatus.Active;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public AdvertiserProfile? AdvertiserProfile { get; init; }
    public SpaceOwnerProfile? SpaceOwnerProfile { get; init; }

    public ICollection<Campaign> Campaigns { get; init; } =
        new List<Campaign>();

    public ICollection<Message> SentMessages { get; init; } =
        new List<Message>();

    public ICollection<Notification> Notifications { get; init; } =
        new List<Notification>();

    public ICollection<Space> OwnedSpaces { get; init; } = new List<Space>();

    public ICollection<BugReport> BugReports { get; init; } =
        new List<BugReport>();
}
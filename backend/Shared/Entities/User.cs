using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Shared.Entities;

[Table("users")]
public sealed class User : EntityBase {
    [MaxLength(255)]
    public string Email { get; init; } = null!;

    [MaxLength(500)]
    public string Password { get; init; } = null!;

    [MaxLength(255)]
    public string Name { get; init; } = null!;

    [MaxLength(50)]
    public string? Phone { get; init; }

    [MaxLength(500)]
    public string? Avatar { get; init; }

    public UserRole Role { get; init; } = UserRole.User;

    public UserStatus Status { get; init; } = UserStatus.Active;

    public ProfileType ActiveProfileType { get; set; } = ProfileType.Advertiser;

    public DateTime? LastLoginAt { get; set; }

    public AdvertiserProfile? AdvertiserProfile { get; set; }


    public SpaceOwnerProfile? SpaceOwnerProfile { get; set; }
}

public sealed class UserConfig : IEntityTypeConfiguration<User> {
    public void Configure(EntityTypeBuilder<User> builder) {
        builder.HasIndex(e => e.Email).IsUnique();

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
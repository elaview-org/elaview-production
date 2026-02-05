using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("advertiser_profiles")]
public sealed class AdvertiserProfile : UserProfileBase {
    [MaxLength(255)]
    public string? CompanyName { get; init; }

    [MaxLength(255)]
    public string? Industry { get; init; }

    [MaxLength(500)]
    public string? Website { get; init; }

    [MaxLength(255)]
    public string? StripeCustomerId { get; set; }

    public ICollection<Campaign> Campaigns { get; init; } = [];

    public ICollection<SavedPaymentMethod> SavedPaymentMethods { get; init; } = [];
}

public sealed class AdvertiserProfileConfig :
    IEntityTypeConfiguration<AdvertiserProfile> {
    public void Configure(EntityTypeBuilder<AdvertiserProfile> builder) {
        builder.HasIndex(e => e.UserId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.User)
            .WithOne(e => e.AdvertiserProfile)
            .HasForeignKey<AdvertiserProfile>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
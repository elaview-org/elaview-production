using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Shared.Entities;

[Table("space_owner_profiles")]
public sealed class SpaceOwnerProfile : UserProfileBase {
    [MaxLength(255)]
    public string? BusinessName { get; init; }

    [MaxLength(255)]
    public string? BusinessType { get; init; }

    public PayoutSchedule PayoutSchedule { get; init; } = PayoutSchedule.Weekly;

    public ICollection<Space> Spaces { get; init; } = [];
}

public sealed class SpaceOwnerProfileConfig :
    IEntityTypeConfiguration<SpaceOwnerProfile> {
    public void Configure(EntityTypeBuilder<SpaceOwnerProfile> builder) {
        builder.HasIndex(e => e.UserId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.User)
            .WithOne(e => e.SpaceOwnerProfile)
            .HasForeignKey<SpaceOwnerProfile>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
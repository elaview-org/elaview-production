using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("manual_payouts")]
public sealed class ManualPayout : EntityBase {
    public Guid SpaceOwnerProfileId { get; init; }

    public SpaceOwnerProfile SpaceOwnerProfile { get; set; } = null!;

    [Precision(10, 2)]
    public decimal Amount { get; init; }

    [MaxLength(255)]
    public string? StripePayoutId { get; set; }

    public ManualPayoutStatus Status { get; set; } = ManualPayoutStatus.Pending;

    public DateTime? ProcessedAt { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }
}

public sealed class ManualPayoutConfig : IEntityTypeConfiguration<ManualPayout> {
    public void Configure(EntityTypeBuilder<ManualPayout> builder) {
        builder.HasIndex(e => e.SpaceOwnerProfileId);
        builder.HasIndex(e => e.Status);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.SpaceOwnerProfile)
            .WithMany(e => e.ManualPayouts)
            .HasForeignKey(e => e.SpaceOwnerProfileId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

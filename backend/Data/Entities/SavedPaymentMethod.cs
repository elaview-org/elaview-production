using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("saved_payment_methods")]
public sealed class SavedPaymentMethod : EntityBase {
    public Guid AdvertiserProfileId { get; init; }

    public AdvertiserProfile AdvertiserProfile { get; set; } = null!;

    [MaxLength(255)]
    public string StripePaymentMethodId { get; init; } = null!;

    [MaxLength(50)]
    public string Brand { get; init; } = null!;

    [MaxLength(4)]
    public string Last4 { get; init; } = null!;

    public int ExpMonth { get; init; }

    public int ExpYear { get; init; }

    public bool IsDefault { get; set; }
}

public sealed class SavedPaymentMethodConfig : IEntityTypeConfiguration<SavedPaymentMethod> {
    public void Configure(EntityTypeBuilder<SavedPaymentMethod> builder) {
        builder.HasIndex(e => e.AdvertiserProfileId);
        builder.HasIndex(e => e.StripePaymentMethodId).IsUnique();

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.AdvertiserProfile)
            .WithMany(e => e.SavedPaymentMethods)
            .HasForeignKey(e => e.AdvertiserProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

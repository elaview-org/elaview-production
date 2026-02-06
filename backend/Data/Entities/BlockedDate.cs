using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("blocked_dates")]
public sealed class BlockedDate : EntityBase {
    public Guid SpaceId { get; init; }

    public Space Space { get; set; } = null!;

    public DateOnly Date { get; init; }

    [MaxLength(500)]
    public string? Reason { get; init; }
}

public sealed class BlockedDateConfig : IEntityTypeConfiguration<BlockedDate> {
    public void Configure(EntityTypeBuilder<BlockedDate> builder) {
        builder.HasIndex(e => new { e.SpaceId, e.Date }).IsUnique();

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Space)
            .WithMany(e => e.BlockedDates)
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

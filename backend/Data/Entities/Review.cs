using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("reviews")]
public sealed class Review : EntityBase {
    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public Guid SpaceId { get; init; }

    public Space Space { get; set; } = null!;

    public ReviewerType ReviewerType { get; init; }

    public Guid ReviewerProfileId { get; init; }

    [Range(1, 5)]
    public int Rating { get; init; }

    [MaxLength(2000)]
    public string? Comment { get; init; }
}

public sealed class ReviewConfig : IEntityTypeConfiguration<Review> {
    public void Configure(EntityTypeBuilder<Review> builder) {
        builder.HasIndex(e => new { e.BookingId, e.ReviewerType }).IsUnique();
        builder.HasIndex(e => e.SpaceId);
        builder.HasIndex(e => e.ReviewerProfileId);
        builder.HasIndex(e => e.Rating);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany(e => e.Reviews)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Space)
            .WithMany(e => e.Reviews)
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("notifications")]
public sealed class Notification : EntityBase {
    public Guid UserId { get; init; }

    public User User { get; set; } = null!;

    public NotificationType Type { get; init; }

    [MaxLength(200)]
    public string Title { get; init; } = null!;

    [MaxLength(1000)]
    public string Body { get; init; } = null!;

    [MaxLength(50)]
    public string? EntityType { get; init; }

    public Guid? EntityId { get; init; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }
}

public sealed class
    NotificationConfig : IEntityTypeConfiguration<Notification> {
    public void Configure(EntityTypeBuilder<Notification> builder) {
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.Type);
        builder.HasIndex(e => e.IsRead);
        builder.HasIndex(e => e.CreatedAt);
        builder.HasIndex(e => new { e.EntityType, e.EntityId });

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
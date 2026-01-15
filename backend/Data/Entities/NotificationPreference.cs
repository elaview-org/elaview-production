using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("notification_preferences")]
public sealed class NotificationPreference : EntityBase {
    public Guid UserId { get; init; }

    public User User { get; set; } = null!;

    public NotificationType NotificationType { get; init; }

    public bool EmailEnabled { get; set; } = true;

    public bool PushEnabled { get; set; } = true;

    public bool InAppEnabled { get; set; } = true;
}

public sealed class
    NotificationPreferenceConfig : IEntityTypeConfiguration<
    NotificationPreference> {
    public void Configure(EntityTypeBuilder<NotificationPreference> builder) {
        builder.HasIndex(e => new { e.UserId, e.NotificationType }).IsUnique();

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
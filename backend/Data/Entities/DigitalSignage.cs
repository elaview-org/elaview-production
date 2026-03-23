using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("digital_signage_screens")]
public sealed class DigitalSignageScreen : EntityBase {
    public Guid SpaceId { get; init; }

    public Space Space { get; set; } = null!;

    public Guid SpaceOwnerProfileId { get; init; }

    public SpaceOwnerProfile SpaceOwnerProfile { get; set; } = null!;

    [MaxLength(200)]
    public string Name { get; init; } = null!;

    public DigitalSignageScreenStatus Status { get; set; } =
        DigitalSignageScreenStatus.Offline;

    [MaxLength(100)]
    public string? Resolution { get; set; }

    public DateTime? LastHeartbeatAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<DigitalSignageDevice> Devices { get; init; } = [];

    public ICollection<DigitalSignageSchedule> Schedules { get; init; } = [];

    public ICollection<DigitalSignageProofEvent> ProofEvents { get; init; } = [];
}

public sealed class DigitalSignageScreenConfig :
    IEntityTypeConfiguration<DigitalSignageScreen> {
    public void Configure(EntityTypeBuilder<DigitalSignageScreen> builder) {
        builder.HasIndex(e => e.SpaceId)
            .IsUnique();
        builder.HasIndex(e => e.SpaceOwnerProfileId);
        builder.HasIndex(e => e.Status);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Space)
            .WithOne()
            .HasForeignKey<DigitalSignageScreen>(e => e.SpaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.SpaceOwnerProfile)
            .WithMany()
            .HasForeignKey(e => e.SpaceOwnerProfileId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

[Table("digital_signage_devices")]
public sealed class DigitalSignageDevice : EntityBase {
    public Guid ScreenId { get; init; }

    public DigitalSignageScreen Screen { get; set; } = null!;

    [MaxLength(100)]
    public string DeviceToken { get; init; } = null!;

    [MaxLength(100)]
    public string DeviceName { get; set; } = null!;

    public DigitalSignageDeviceType Type { get; init; } =
        DigitalSignageDeviceType.Other;

    public DigitalSignageDeviceStatus Status { get; set; } =
        DigitalSignageDeviceStatus.Unpaired;

    [MaxLength(6)]
    public string? PairingCode { get; set; }

    public DateTime? PairingCodeExpiresAt { get; set; }

    public DateTime? LastSeenAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<DigitalSignageProofEvent> ProofEvents { get; init; } = [];
}

public sealed class DigitalSignageDeviceConfig :
    IEntityTypeConfiguration<DigitalSignageDevice> {
    public void Configure(EntityTypeBuilder<DigitalSignageDevice> builder) {
        builder.HasIndex(e => e.ScreenId);
        builder.HasIndex(e => e.DeviceToken)
            .IsUnique();
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.PairingCode);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Screen)
            .WithMany(e => e.Devices)
            .HasForeignKey(e => e.ScreenId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

[Table("digital_signage_schedules")]
public sealed class DigitalSignageSchedule : EntityBase {
    public Guid ScreenId { get; init; }

    public DigitalSignageScreen Screen { get; set; } = null!;

    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public Guid CampaignId { get; init; }

    public Campaign Campaign { get; set; } = null!;

    [MaxLength(500)]
    public string CreativeAssetUrl { get; set; } = null!;

    public DigitalSignageCreativeType CreativeType { get; init; } =
        DigitalSignageCreativeType.Image;

    public int RotationIntervalSeconds { get; init; } = 30;

    public DateTime StartDate { get; init; }

    public DateTime EndDate { get; init; }

    public DigitalSignageScheduleStatus Status { get; set; } =
        DigitalSignageScheduleStatus.Pending;

    public DateTime? PushedToDevicesAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<DigitalSignageProofEvent> ProofEvents { get; init; } = [];
}

public sealed class DigitalSignageScheduleConfig :
    IEntityTypeConfiguration<DigitalSignageSchedule> {
    public void Configure(EntityTypeBuilder<DigitalSignageSchedule> builder) {
        builder.HasIndex(e => e.ScreenId);
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.CampaignId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => new { e.StartDate, e.EndDate });

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Screen)
            .WithMany(e => e.Schedules)
            .HasForeignKey(e => e.ScreenId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Campaign)
            .WithMany()
            .HasForeignKey(e => e.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

[Table("digital_signage_proof_events")]
public sealed class DigitalSignageProofEvent : EntityBase {
    public Guid ScreenId { get; init; }

    public DigitalSignageScreen Screen { get; set; } = null!;

    public Guid DeviceId { get; init; }

    public DigitalSignageDevice Device { get; set; } = null!;

    public Guid ScheduleId { get; init; }

    public DigitalSignageSchedule Schedule { get; set; } = null!;

    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public DateTime DisplayedAt { get; init; }

    public int DisplayedDurationSeconds { get; init; }

    [MaxLength(1000)]
    public string? Metadata { get; set; }
}

public sealed class DigitalSignageProofEventConfig :
    IEntityTypeConfiguration<DigitalSignageProofEvent> {
    public void Configure(EntityTypeBuilder<DigitalSignageProofEvent> builder) {
        builder.HasIndex(e => e.ScreenId);
        builder.HasIndex(e => e.DeviceId);
        builder.HasIndex(e => e.ScheduleId);
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.DisplayedAt);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Screen)
            .WithMany(e => e.ProofEvents)
            .HasForeignKey(e => e.ScreenId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Device)
            .WithMany(e => e.ProofEvents)
            .HasForeignKey(e => e.DeviceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Schedule)
            .WithMany(e => e.ProofEvents)
            .HasForeignKey(e => e.ScheduleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
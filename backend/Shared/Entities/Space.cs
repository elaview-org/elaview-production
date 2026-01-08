using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Shared.Entities;

[Table("spaces")]
public sealed class Space : EntityBase {
    [MaxLength(50)]

    public Guid SpaceOwnerProfileId { get; set; }

    public SpaceOwnerProfile SpaceOwnerProfile { get; set; } = null!;

    [MaxLength(500)]
    public string Title { get; init; } = null!;

    [MaxLength(500)]
    public string? Description { get; init; }

    public SpaceType Type { get; init; }

    public SpaceStatus Status { get; init; } = SpaceStatus.Active;

    [MaxLength(500)]
    public string Address { get; init; } = null!;

    [MaxLength(100)]
    public string City { get; init; } = null!;

    [MaxLength(100)]
    public string State { get; init; } = null!;

    [MaxLength(20)]
    public string? ZipCode { get; init; }

    public double Latitude { get; init; }

    public double Longitude { get; init; }

    public double? Width { get; init; }

    public double? Height { get; init; }

    [MaxLength(100)]
    public string? Dimensions { get; init; }

    [MaxLength(100)]
    public string? DimensionsText { get; init; }

    public decimal PricePerDay { get; init; }

    public decimal? InstallationFee { get; init; }

    public int MinDuration { get; init; } = 1;

    public int? MaxDuration { get; init; }

    public List<string> Images { get; init; } = new();

    public DateTime? AvailableFrom { get; init; }

    public DateTime? AvailableTo { get; init; }

    public int TotalBookings { get; set; } = 0;

    public decimal TotalRevenue { get; set; } = 0;

    public double? AverageRating { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; init; }

    [MaxLength(500)]
    public string? Traffic { get; init; }
}

public sealed class SpaceConfig :
    IEntityTypeConfiguration<Space> {
    public void Configure(EntityTypeBuilder<Space> builder) {
        builder.HasIndex(e => e.SpaceOwnerProfileId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.SpaceOwnerProfile)
            .WithMany(e => e.Spaces)
            .HasForeignKey(e => e.SpaceOwnerProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
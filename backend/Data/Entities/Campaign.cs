using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("campaigns")]
public sealed class Campaign : EntityBase {
    [MaxLength(50)]
    public Guid AdvertiserProfileId { get; set; }

    public AdvertiserProfile AdvertiserProfile { get; set; } = null!;

    [MaxLength(500)]
    public string Name { get; init; } = null!;

    [MaxLength(500)]
    public string? Description { get; init; }

    [MaxLength(1000)]
    public string ImageUrl { get; init; } = null!;

    [MaxLength(50)]
    public string? TargetAudience { get; init; }

    [MaxLength(50)]
    public string? Goals { get; init; }

    public decimal? TotalBudget { get; init; }

    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }

    public ICollection<Booking> Bookings { get; init; } = [];
}

public sealed class CampaignConfig :
    IEntityTypeConfiguration<Campaign> {
    public void Configure(EntityTypeBuilder<Campaign> builder) {
        builder.HasIndex(e => e.AdvertiserProfileId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.AdvertiserProfile)
            .WithMany(e => e.Campaigns)
            .HasForeignKey(e => e.AdvertiserProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
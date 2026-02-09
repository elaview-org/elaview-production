using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("pricing_rules")]
public sealed class PricingRule : EntityBase {
    public Guid SpaceId { get; init; }

    public Space Space { get; set; } = null!;

    public PricingRuleType Type { get; set; }

    [Precision(10, 2)]
    public decimal Value { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [Column(TypeName = "jsonb")]
    public List<int>? DaysOfWeek { get; set; }

    [MaxLength(200)]
    public string? Label { get; set; }

    public int Priority { get; set; }
}

public sealed class PricingRuleConfig : IEntityTypeConfiguration<PricingRule> {
    public void Configure(EntityTypeBuilder<PricingRule> builder) {
        builder.HasIndex(e => e.SpaceId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Space)
            .WithMany(e => e.PricingRules)
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

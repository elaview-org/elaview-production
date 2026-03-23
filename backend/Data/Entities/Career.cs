using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("careers")]
public sealed class Career : EntityBase {
	[MaxLength(255)]
	public string Title { get; set; } = null!;

	public CareerDepartment Department { get; set; }

	public CareerType Type { get; set; }

	[MaxLength(255)]
	public string Location { get; set; } = null!;

	[MaxLength(4000)]
	public string Description { get; set; } = null!;

	[MaxLength(4000)]
	public string Requirements { get; set; } = null!;

	public bool IsActive { get; set; } = true;

	public DateTime? ExpiresAt { get; set; }
}

public sealed class CareerConfig : IEntityTypeConfiguration<Career> {
	public void Configure(EntityTypeBuilder<Career> builder) {
		builder.HasIndex(e => e.IsActive);
		builder.HasIndex(e => e.Department);

		builder.Property(e => e.Id)
			.HasDefaultValueSql("gen_random_uuid()");

		builder.Property(e => e.CreatedAt)
			.IsRequired()
			.HasDefaultValueSql("CURRENT_TIMESTAMP");
	}
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElaviewBackend.Data.Seeding;

[Table("__SeedHistory")]
public sealed class SeedHistory {
    [Key]
    [MaxLength(256)]
    public required string SeederName { get; init; }

    public DateTime AppliedAt { get; init; }
}
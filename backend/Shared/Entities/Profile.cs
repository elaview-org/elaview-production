namespace ElaviewBackend.Shared.Entities;

public sealed class Profile : EntityBase {
    public ProfileType ProfileType { get; init; }

    public User User { get; init; } = null!;
}
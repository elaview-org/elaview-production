using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Data.Seeding.Generators;

public sealed class UserGenerator {
    private readonly Faker<User> _faker;

    public UserGenerator(int? seed = null) {
        if (seed.HasValue)
            Randomizer.Seed = new Random(seed.Value);

        _faker = new Faker<User>()
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Password, _ => BCrypt.Net.BCrypt.HashPassword("Test123!"))
            .RuleFor(u => u.Name, f => f.Name.FullName())
            .RuleFor(u => u.Phone, f => f.Phone.PhoneNumber("###-###-####"))
            .RuleFor(u => u.Role, _ => UserRole.User)
            .RuleFor(u => u.Status, _ => UserStatus.Active);
    }

    public User Generate() => _faker.Generate();

    public List<User> Generate(int count) => _faker.Generate(count);
}
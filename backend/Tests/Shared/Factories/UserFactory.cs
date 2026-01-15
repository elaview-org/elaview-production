using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class UserFactory {
    private static readonly Faker Faker = new();

    public static User Create(Action<User>? customize = null) {
        var user = new User {
            Id = Guid.NewGuid(),
            Email = Faker.Internet.Email(),
            Password = BCrypt.Net.BCrypt.HashPassword("Test123!"),
            Name = Faker.Name.FullName(),
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.Advertiser,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(user);
        return user;
    }

    public static User CreateAdmin(Action<User>? customize = null) {
        var user = new User {
            Id = Guid.NewGuid(),
            Email = $"admin-{Guid.NewGuid():N}@test.com",
            Password = BCrypt.Net.BCrypt.HashPassword("Test123!"),
            Name = Faker.Name.FullName(),
            Role = UserRole.Admin,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.Advertiser,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(user);
        return user;
    }

    public static List<User> CreateMany(int count,
        Action<User, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var user = Create();
                customize?.Invoke(user, i);
                return user;
            })
            .ToList();
    }
}
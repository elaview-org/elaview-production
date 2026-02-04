using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Microsoft.EntityFrameworkCore;
using ValidationException = ElaviewBackend.Features.Shared.Errors.ValidationException;

namespace ElaviewBackend.Features.Auth;

public class AuthService(AppDbContext dbContext) {
    public async Task<User?> CreateUserAsync(string email, string password,
        string name) {
        var existingUser = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null) return null;

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User {
            Email = email,
            Password = hashedPassword,
            Name = name
        };

        var advertiserProfile = new AdvertiserProfile {
            UserId = user.Id,
            User = user
        };
        await dbContext.AdvertiserProfiles.AddAsync(advertiserProfile);

        var spaceOwnerProfileExtension = new SpaceOwnerProfile {
            UserId = user.Id,
            User = user
        };
        await dbContext.SpaceOwnerProfiles.AddAsync(spaceOwnerProfileExtension);

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<User?> ValidateUserAsync(string email, string password) {
        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) return null;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
        if (!isPasswordValid) return null;

        user.LastLoginAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task VerifyPasswordAsync(Guid userId, string password,
        CancellationToken ct) {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct)
                   ?? throw new NotFoundException("User", userId);

        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            throw new ValidationException("Password", "Password is incorrect");
    }

    public async Task ChangePasswordAsync(Guid userId, string currentPassword,
        string newPassword, CancellationToken ct) {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct)
                   ?? throw new NotFoundException("User", userId);

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
            throw new ValidationException("Password",
                "Current password is incorrect");

        dbContext.Entry(user).Property(u => u.Password).CurrentValue =
            BCrypt.Net.BCrypt.HashPassword(newPassword);
        await dbContext.SaveChangesAsync(ct);
    }
}
using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Auth;

public class AuthService(AppDbContext dbContext) {
    public async Task<User?> CreateUserAsync(string email, string password,
        string? name = null) {
        var existingUser = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null) {
            return null;
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User {
            Email = email,
            Password = hashedPassword,
            Name = name
        };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<User?> ValidateUserAsync(string email, string password) {
        var user = await dbContext.Users
            .Include(u => u.AdvertiserProfile)
            .Include(u => u.SpaceOwnerProfile)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) {
            return null;
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
        if (!isPasswordValid) {
            return null;
        }

        user.LastLoginAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return user;
    }
}
using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Auth;

public class AuthService(AppDbContext dbContext) {
    public async Task<User?> CreateUserAsync(string email, string password,
        string? name = null) {
        var existingUser = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null) return null;

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User {
            Email = email,
            Password = hashedPassword,
            Name = name
        };
        
        var advertiserProfile = new Profile {
            User = user,
            ProfileType = ProfileType.Advertiser
        };
        dbContext.Profiles.Add(advertiserProfile);
        await dbContext.SaveChangesAsync();

        var advertiserProfileExtension = new AdvertiserProfile {
            Profile = advertiserProfile,
            OnboardingComplete = false
        };
        dbContext.AdvertiserProfiles.Add(advertiserProfileExtension);

        var spaceOwnerProfile = new Profile {
            User = user,
            ProfileType = ProfileType.SpaceOwner
        };
        dbContext.Profiles.Add(spaceOwnerProfile);
        await dbContext.SaveChangesAsync();

        var spaceOwnerProfileExtension = new SpaceOwnerProfile {
            Profile = spaceOwnerProfile,
            PayoutSchedule = PayoutSchedule.Weekly,
            OnboardingComplete = false
        };
        dbContext.SpaceOwnerProfiles.Add(spaceOwnerProfileExtension);

        user.ActiveProfile = advertiserProfile;

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<User?> ValidateUserAsync(string email, string password) {
        var user = await dbContext.Users
            .Include(u => u.ActiveProfile)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) return null;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
        if (!isPasswordValid) return null;

        user.LastLoginAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return user;
    }
}
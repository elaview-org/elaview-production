using System.Net.Http.Json;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Shared.Factories;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Fixtures;

[Collection("Integration")]
public abstract class IntegrationTestBase(IntegrationTestFixture fixture) : IAsyncLifetime {
    protected readonly IntegrationTestFixture Fixture = fixture;
    protected HttpClient Client { get; private set; } = null!;

    public virtual Task InitializeAsync() {
        Client = Fixture.CreateHttpClient();
        return Task.CompletedTask;
    }

    public virtual async Task DisposeAsync() {
        await Fixture.ResetDatabaseAsync();
    }

    protected async Task<User> CreateAndLoginUserAsync(Action<User>? customize = null) {
        var user = UserFactory.Create(customize);
        await SeedUserAsync(user);
        await LoginAsync(user.Email, "Test123!");
        return user;
    }

    protected async Task<User> LoginAsAdminAsync() {
        var admin = UserFactory.CreateAdmin();
        await SeedUserAsync(admin);
        await LoginAsync(admin.Email, "Test123!");
        return admin;
    }

    protected async Task LoginAsync(string email, string password) {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email,
            password
        });
        response.EnsureSuccessStatusCode();
    }

    protected async Task LogoutAsync() {
        var response = await Client.PostAsync("/api/auth/logout", null);
        response.EnsureSuccessStatusCode();
    }

    protected async Task<User> SeedUserAsync(User? user = null) {
        user ??= UserFactory.Create();
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    protected async Task<User> SeedUserAsync(string email, string password) {
        var user = new User {
            Id = Guid.NewGuid(),
            Email = email,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
            Name = "Test User",
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.Advertiser,
            CreatedAt = DateTime.UtcNow
        };
        return await SeedUserAsync(user);
    }

    protected async Task<List<User>> SeedUsersAsync(int count) {
        var users = UserFactory.CreateMany(count);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.AddRange(users);
        await context.SaveChangesAsync();
        return users;
    }

    protected async Task<Space> SeedSpaceAsync(Guid spaceOwnerProfileId, Action<Space>? customize = null) {
        var space = SpaceFactory.Create(spaceOwnerProfileId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Space> SeedSpaceWithPricingAsync(Guid spaceOwnerProfileId, decimal pricePerDay, decimal? installationFee) {
        var space = SpaceFactory.CreateWithPricing(spaceOwnerProfileId, pricePerDay, installationFee);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Space> SeedSpaceWithStatusAsync(Guid spaceOwnerProfileId, SpaceStatus status) {
        var space = SpaceFactory.CreateWithStatus(spaceOwnerProfileId, status);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<List<Space>> SeedSpacesAsync(Guid spaceOwnerProfileId, int count) {
        var spaces = SpaceFactory.CreateMany(spaceOwnerProfileId, count);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.AddRange(spaces);
        await context.SaveChangesAsync();
        return spaces;
    }

    protected async Task<Campaign> SeedCampaignAsync(Guid advertiserProfileId, Action<Campaign>? customize = null) {
        var campaign = CampaignFactory.Create(advertiserProfileId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Campaigns.Add(campaign);
        await context.SaveChangesAsync();
        return campaign;
    }

    protected async Task<Booking> SeedBookingAsync(Guid campaignId, Guid spaceId, Action<Booking>? customize = null) {
        var booking = BookingFactory.Create(campaignId, spaceId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<Booking> SeedBookingWithStatusAsync(Guid campaignId, Guid spaceId, BookingStatus status) {
        var booking = BookingFactory.CreateWithStatus(campaignId, spaceId, status);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<(User User, SpaceOwnerProfile Profile)> SeedSpaceOwnerAsync(Action<User>? customizeUser = null) {
        var user = UserFactory.Create(u => {
            u.ActiveProfileType = ProfileType.SpaceOwner;
            customizeUser?.Invoke(u);
        });
        var profile = SpaceOwnerProfileFactory.Create(user.Id);

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.Add(user);
        context.SpaceOwnerProfiles.Add(profile);
        await context.SaveChangesAsync();

        return (user, profile);
    }

    protected async Task<(User User, AdvertiserProfile Profile)> SeedAdvertiserAsync(Action<User>? customizeUser = null) {
        var user = UserFactory.Create(u => {
            u.ActiveProfileType = ProfileType.Advertiser;
            customizeUser?.Invoke(u);
        });
        var profile = AdvertiserProfileFactory.Create(user.Id);

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.Add(user);
        context.AdvertiserProfiles.Add(profile);
        await context.SaveChangesAsync();

        return (user, profile);
    }

    protected T GetService<T>() where T : notnull {
        var scope = Fixture.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<T>();
    }
}
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Shared.Factories;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Fixtures;

[Collection("Integration")]
public abstract class IntegrationTestBase(IntegrationTestFixture fixture)
    : IAsyncLifetime {
    protected readonly IntegrationTestFixture Fixture = fixture;
    protected HttpClient Client { get; private set; } = null!;

    public virtual Task InitializeAsync() {
        Client = Fixture.CreateHttpClient();
        return Task.CompletedTask;
    }

    public virtual async Task DisposeAsync() {
        await Fixture.ResetDatabaseAsync();
    }

    protected async Task<User> CreateAndLoginUserAsync(
        Action<User>? customize = null) {
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

    protected async Task<Space> SeedSpaceAsync(Guid spaceOwnerProfileId,
        Action<Space>? customize = null) {
        var space = SpaceFactory.Create(spaceOwnerProfileId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Space> SeedSpaceWithPricingAsync(
        Guid spaceOwnerProfileId, decimal pricePerDay,
        decimal? installationFee) {
        var space = SpaceFactory.CreateWithPricing(spaceOwnerProfileId,
            pricePerDay, installationFee);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Space> SeedSpaceWithStatusAsync(
        Guid spaceOwnerProfileId, SpaceStatus status) {
        var space = SpaceFactory.CreateWithStatus(spaceOwnerProfileId, status);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<List<Space>> SeedSpacesAsync(Guid spaceOwnerProfileId,
        int count) {
        var spaces = SpaceFactory.CreateMany(spaceOwnerProfileId, count);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.AddRange(spaces);
        await context.SaveChangesAsync();
        return spaces;
    }

    protected async Task<Space> SeedSpaceWithPropertiesAsync(
        Guid spaceOwnerProfileId, string city, decimal pricePerDay,
        int minDuration = 7) {
        var space = new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Title = "Test Space",
            Description = "Test Description",
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = "123 Test St",
            City = city,
            State = "NY",
            Latitude = 40.7128,
            Longitude = -74.0060,
            PricePerDay = pricePerDay,
            InstallationFee = 25.00m,
            MinDuration = minDuration,
            CreatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Space> SeedSpaceWithMinDurationAsync(
        Guid spaceOwnerProfileId, int minDuration) {
        var space = new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Title = "Test Space",
            Description = "Test Description",
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = "123 Test St",
            City = "New York",
            State = "NY",
            Latitude = 40.7128,
            Longitude = -74.0060,
            PricePerDay = 50.00m,
            InstallationFee = 25.00m,
            MinDuration = minDuration,
            CreatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Spaces.Add(space);
        await context.SaveChangesAsync();
        return space;
    }

    protected async Task<Campaign> SeedCampaignAsync(Guid advertiserProfileId,
        Action<Campaign>? customize = null) {
        var campaign = CampaignFactory.Create(advertiserProfileId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Campaigns.Add(campaign);
        await context.SaveChangesAsync();
        return campaign;
    }

    protected async Task<Booking> SeedBookingAsync(Guid campaignId,
        Guid spaceId, Action<Booking>? customize = null) {
        var booking = BookingFactory.Create(campaignId, spaceId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<Booking> SeedBookingWithStatusAsync(Guid campaignId,
        Guid spaceId, BookingStatus status) {
        var booking =
            BookingFactory.CreateWithStatus(campaignId, spaceId, status);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<Booking> SeedBookingWithDatesAsync(Guid campaignId,
        Guid spaceId, DateTime startDate, DateTime endDate,
        BookingStatus status = BookingStatus.PendingApproval) {
        var totalDays = (endDate - startDate).Days;
        var pricePerDay = 50.00m;
        var installationFee = 25.00m;
        var subtotal = pricePerDay * totalDays;
        var platformFeeAmount = subtotal * 0.10m;

        var booking = new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaignId,
            SpaceId = spaceId,
            Status = status,
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc),
            TotalDays = totalDays,
            PricePerDay = pricePerDay,
            InstallationFee = installationFee,
            SubtotalAmount = subtotal,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = platformFeeAmount,
            TotalAmount = subtotal + installationFee + platformFeeAmount,
            OwnerPayoutAmount = subtotal + installationFee,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<(User User, SpaceOwnerProfile Profile)>
        SeedSpaceOwnerAsync(Action<User>? customizeUser = null) {
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

    protected async Task<(User User, AdvertiserProfile Profile)>
        SeedAdvertiserAsync(Action<User>? customizeUser = null) {
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

    protected async Task<Booking> SeedBookingWithPricingAsync(
        Guid campaignId, Guid spaceId, decimal subtotal, decimal installationFee,
        BookingStatus status = BookingStatus.PendingApproval) {
        var startDate = DateTime.UtcNow.AddDays(7);
        var endDate = DateTime.UtcNow.AddDays(14);
        var totalDays = (endDate - startDate).Days;
        var platformFeeAmount = subtotal * 0.10m;

        var booking = new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaignId,
            SpaceId = spaceId,
            Status = status,
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = subtotal / totalDays,
            InstallationFee = installationFee,
            SubtotalAmount = subtotal,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = platformFeeAmount,
            TotalAmount = subtotal + installationFee + platformFeeAmount,
            OwnerPayoutAmount = subtotal + installationFee,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }

    protected async Task<(Booking Booking, BookingProof Proof)> SeedVerifiedBookingWithProofAsync(
        Guid campaignId, Guid spaceId) {
        var booking = BookingFactory.CreateWithStatus(campaignId, spaceId, BookingStatus.Verified);
        var proof = new BookingProof {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            Photos = ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
            Status = ProofStatus.Pending,
            SubmittedAt = DateTime.UtcNow.AddHours(-1),
            AutoApproveAt = DateTime.UtcNow.AddHours(47),
            CreatedAt = DateTime.UtcNow.AddHours(-1)
        };

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        context.BookingProofs.Add(proof);
        await context.SaveChangesAsync();
        return (booking, proof);
    }

    protected async Task<Payment> SeedPaymentAsync(Guid bookingId,
        PaymentStatus status = PaymentStatus.Pending) {
        var payment = status == PaymentStatus.Succeeded
            ? PaymentFactory.CreateSucceeded(bookingId)
            : PaymentFactory.Create(bookingId, p => p.Status = status);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payments.Add(payment);
        await context.SaveChangesAsync();
        return payment;
    }

    protected async Task<Payout> SeedPayoutAsync(Guid bookingId,
        Guid spaceOwnerProfileId, PayoutStage stage,
        PayoutStatus status = PayoutStatus.Pending) {
        Payout payout;
        if (status == PayoutStatus.Completed) {
            payout = PayoutFactory.CreateCompleted(bookingId, spaceOwnerProfileId, stage);
        }
        else {
            payout = new Payout {
                Id = Guid.NewGuid(),
                BookingId = bookingId,
                SpaceOwnerProfileId = spaceOwnerProfileId,
                Stage = stage,
                Amount = 100.00m,
                Status = status,
                CreatedAt = DateTime.UtcNow
            };
        }
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payouts.Add(payout);
        await context.SaveChangesAsync();
        return payout;
    }

    protected async Task<BlockedDate> SeedBlockedDateAsync(Guid spaceId, DateOnly date, string? reason = null) {
        var blockedDate = BlockedDateFactory.CreateForDate(spaceId, date, reason);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.BlockedDates.Add(blockedDate);
        await context.SaveChangesAsync();
        return blockedDate;
    }

    protected async Task<List<BlockedDate>> SeedBlockedDatesAsync(Guid spaceId, DateOnly startDate, int days, string? reason = null) {
        var blockedDates = BlockedDateFactory.CreateRange(spaceId, startDate, days, reason);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.BlockedDates.AddRange(blockedDates);
        await context.SaveChangesAsync();
        return blockedDates;
    }

    protected async Task<PricingRule> SeedPricingRuleAsync(Guid spaceId, Action<PricingRule>? customize = null) {
        var rule = PricingRuleFactory.Create(spaceId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.PricingRules.Add(rule);
        await context.SaveChangesAsync();
        return rule;
    }
}
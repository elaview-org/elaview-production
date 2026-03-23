using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.DigitalSignage;
using ElaviewBackend.Settings;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Xunit;

namespace ElaviewBackend.Tests.Unit.DigitalSignage;

public sealed class AutoScheduleTests : IDisposable {
    private readonly AppDbContext _context;
    private readonly DigitalSignageRepository _repository;
    private readonly DigitalSignageService _service;

    public AutoScheduleTests() {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: $"AutoSchedule_{Guid.NewGuid()}")
            .Options;

        _context = new AppDbContext(options);
        _repository = new DigitalSignageRepository(_context);
        _service = new DigitalSignageService(
            _repository,
            _context,
            new NoOpHttpClientFactory(),
            Options.Create(new GlobalSettings()),
            NullLogger<DigitalSignageService>.Instance);
    }

    public void Dispose() {
        _context.Dispose();
    }

    private async Task<(User Owner, SpaceOwnerProfile Profile, Space Space, Campaign Campaign, Booking Booking)> SeedDigitalDisplayBookingAsync() {
        var owner = new User {
            Id = Guid.NewGuid(),
            Email = "owner@test.com",
            Password = "hash",
            Name = "Test Owner",
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.SpaceOwner,
            CreatedAt = DateTime.UtcNow
        };

        var ownerProfile = new SpaceOwnerProfile {
            Id = Guid.NewGuid(),
            UserId = owner.Id,
            BusinessName = "Test Business",
            BusinessType = "Retail",
            CreatedAt = DateTime.UtcNow
        };

        var space = new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = ownerProfile.Id,
            Title = "Test Digital Display",
            Description = "A digital display",
            Type = SpaceType.DigitalDisplay,
            Status = SpaceStatus.Active,
            Address = "123 Main St",
            City = "Austin",
            State = "TX",
            PricePerDay = 50m,
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };

        var advertiser = new User {
            Id = Guid.NewGuid(),
            Email = "adv@test.com",
            Password = "hash",
            Name = "Test Advertiser",
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.Advertiser,
            CreatedAt = DateTime.UtcNow
        };

        var advertiserProfile = new AdvertiserProfile {
            Id = Guid.NewGuid(),
            UserId = advertiser.Id,
            CompanyName = "Test Company",
            CreatedAt = DateTime.UtcNow
        };

        var campaign = new Campaign {
            Id = Guid.NewGuid(),
            AdvertiserProfileId = advertiserProfile.Id,
            Name = "Summer Promo",
            ImageUrl = "https://cdn.example.com/creative.png",
            Status = CampaignStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var booking = new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaign.Id,
            SpaceId = space.Id,
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(37),
            TotalDays = 30,
            PricePerDay = 50m,
            SubtotalAmount = 1500m,
            InstallationFee = 0m,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = 150m,
            TotalAmount = 1650m,
            OwnerPayoutAmount = 1500m,
            Status = BookingStatus.Paid,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.AddRange(owner, advertiser);
        _context.SpaceOwnerProfiles.Add(ownerProfile);
        _context.AdvertiserProfiles.Add(advertiserProfile);
        _context.Spaces.Add(space);
        _context.Campaigns.Add(campaign);
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return (owner, ownerProfile, space, campaign, booking);
    }

    [Fact]
    public async Task AutoSchedule_CreatesSchedule_WhenDigitalDisplayHasScreen() {
        // Arrange
        var (owner, profile, space, campaign, booking) =
            await SeedDigitalDisplayBookingAsync();

        var screen = new DigitalSignageScreen {
            Id = Guid.NewGuid(),
            SpaceId = space.Id,
            SpaceOwnerProfileId = profile.Id,
            Name = "Main Screen",
            Status = DigitalSignageScreenStatus.Online,
            UpdatedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _context.DigitalSignageScreens.Add(screen);
        await _context.SaveChangesAsync();

        // Act
        await _service.TryAutoScheduleForBookingAsync(booking.Id,
            CancellationToken.None);

        // Assert
        var schedules = await _context.DigitalSignageSchedules.ToListAsync();
        schedules.Should().HaveCount(1);

        var schedule = schedules.Single();
        schedule.BookingId.Should().Be(booking.Id);
        schedule.CampaignId.Should().Be(campaign.Id);
        schedule.ScreenId.Should().Be(screen.Id);
        schedule.CreativeAssetUrl.Should().Be(campaign.ImageUrl);
        schedule.StartDate.Should().Be(booking.StartDate);
        schedule.EndDate.Should().Be(booking.EndDate);
        schedule.Status.Should().Be(DigitalSignageScheduleStatus.Pending);
    }

    [Fact]
    public async Task AutoSchedule_DoesNothing_WhenSpaceIsNotDigitalDisplay() {
        // Arrange — use a Storefront space type by creating from scratch
        var owner = new User {
            Id = Guid.NewGuid(),
            Email = "owner2@test.com",
            Password = "hash",
            Name = "Test Owner",
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.SpaceOwner,
            CreatedAt = DateTime.UtcNow
        };
        var ownerProfile = new SpaceOwnerProfile {
            Id = Guid.NewGuid(),
            UserId = owner.Id,
            BusinessName = "Test Biz",
            BusinessType = "Retail",
            CreatedAt = DateTime.UtcNow
        };
        var storefrontSpace = new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = ownerProfile.Id,
            Title = "Storefront",
            Description = "A storefront",
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = "456 Oak",
            City = "Austin",
            State = "TX",
            PricePerDay = 30m,
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };
        var advertiser = new User {
            Id = Guid.NewGuid(),
            Email = "adv2@test.com",
            Password = "hash",
            Name = "Adv",
            Role = UserRole.User,
            Status = UserStatus.Active,
            ActiveProfileType = ProfileType.Advertiser,
            CreatedAt = DateTime.UtcNow
        };
        var advProfile = new AdvertiserProfile {
            Id = Guid.NewGuid(),
            UserId = advertiser.Id,
            CompanyName = "Adv Corp",
            CreatedAt = DateTime.UtcNow
        };
        var campaign = new Campaign {
            Id = Guid.NewGuid(),
            AdvertiserProfileId = advProfile.Id,
            Name = "Promo",
            ImageUrl = "https://cdn.example.com/img.png",
            Status = CampaignStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        var booking = new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaign.Id,
            SpaceId = storefrontSpace.Id,
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(37),
            TotalDays = 30,
            PricePerDay = 30m,
            SubtotalAmount = 900m,
            InstallationFee = 0m,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = 90m,
            TotalAmount = 990m,
            OwnerPayoutAmount = 900m,
            Status = BookingStatus.Paid,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.AddRange(owner, advertiser);
        _context.SpaceOwnerProfiles.Add(ownerProfile);
        _context.AdvertiserProfiles.Add(advProfile);
        _context.Spaces.Add(storefrontSpace);
        _context.Campaigns.Add(campaign);
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Act
        await _service.TryAutoScheduleForBookingAsync(booking.Id,
            CancellationToken.None);

        // Assert
        var schedules = await _context.DigitalSignageSchedules.ToListAsync();
        schedules.Should().BeEmpty();
    }

    [Fact]
    public async Task AutoSchedule_DoesNothing_WhenNoScreenRegistered() {
        // Arrange — DigitalDisplay space but no screen
        var (_, _, _, _, booking) = await SeedDigitalDisplayBookingAsync();

        // Act
        await _service.TryAutoScheduleForBookingAsync(booking.Id,
            CancellationToken.None);

        // Assert
        var schedules = await _context.DigitalSignageSchedules.ToListAsync();
        schedules.Should().BeEmpty();
    }

    [Fact]
    public async Task AutoSchedule_DoesNothing_WhenBookingNotFound() {
        // Act — random booking id that doesn't exist
        await _service.TryAutoScheduleForBookingAsync(Guid.NewGuid(),
            CancellationToken.None);

        // Assert
        var schedules = await _context.DigitalSignageSchedules.ToListAsync();
        schedules.Should().BeEmpty();
    }

    [Fact]
    public async Task AutoSchedule_DoesNotDuplicate_WhenCalledTwice() {
        // Arrange
        var (owner, profile, space, campaign, booking) =
            await SeedDigitalDisplayBookingAsync();

        _context.DigitalSignageScreens.Add(new DigitalSignageScreen {
            Id = Guid.NewGuid(),
            SpaceId = space.Id,
            SpaceOwnerProfileId = profile.Id,
            Name = "Screen",
            Status = DigitalSignageScreenStatus.Online,
            UpdatedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        // Act — call twice
        await _service.TryAutoScheduleForBookingAsync(booking.Id,
            CancellationToken.None);
        await _service.TryAutoScheduleForBookingAsync(booking.Id,
            CancellationToken.None);

        // Assert — should still be exactly 1 schedule
        var schedules = await _context.DigitalSignageSchedules.ToListAsync();
        schedules.Should().HaveCount(1);
    }
}

/// <summary>
/// Stub IHttpClientFactory for unit tests — returns a default HttpClient.
/// </summary>
internal sealed class NoOpHttpClientFactory : IHttpClientFactory {
    public HttpClient CreateClient(string name) => new();
}

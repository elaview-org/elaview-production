using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Users;

[Collection("Integration")]
public sealed class ResponseMetricsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetResponseMetrics_NoBookings_ReturnsZeros() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.QueryAsync<MeWithSpaceOwnerProfileResponse>("""
            query {
                me {
                    id
                    email
                    spaceOwnerProfile {
                        id
                        responseRate
                        averageResponseTime
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Me.Should().NotBeNull();
        response.Data!.Me!.SpaceOwnerProfile.Should().NotBeNull();
        response.Data!.Me!.SpaceOwnerProfile!.ResponseRate.Should().Be(0);
        response.Data!.Me!.SpaceOwnerProfile!.AverageResponseTime.Should().Be(0);
    }

    [Fact]
    public async Task GetResponseMetrics_AllPendingBookings_ReturnsZeroResponseRate() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.PendingApproval);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.PendingApproval);

        var response = await Client.QueryAsync<MeWithSpaceOwnerProfileResponse>("""
            query {
                me {
                    id
                    spaceOwnerProfile {
                        responseRate
                        averageResponseTime
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Me!.SpaceOwnerProfile!.ResponseRate.Should().Be(0);
    }

    [Fact]
    public async Task GetResponseMetrics_MixedBookingStatuses_CalculatesCorrectResponseRate() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.PendingApproval);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.Approved);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.Paid);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id, BookingStatus.Rejected);

        var response = await Client.QueryAsync<MeWithSpaceOwnerProfileResponse>("""
            query {
                me {
                    id
                    spaceOwnerProfile {
                        responseRate
                        averageResponseTime
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Me!.SpaceOwnerProfile!.ResponseRate.Should().Be(75);
    }

    [Fact]
    public async Task GetResponseMetrics_RespondedBookings_CalculatesAverageResponseTime() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var createdAt = DateTime.UtcNow.AddHours(-48);
        var updatedAt = DateTime.UtcNow;

        await SeedBookingWithTimestampsAsync(campaign.Id, space.Id, createdAt, updatedAt, BookingStatus.Approved);

        var response = await Client.QueryAsync<MeWithSpaceOwnerProfileResponse>("""
            query {
                me {
                    id
                    spaceOwnerProfile {
                        responseRate
                        averageResponseTime
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Me!.SpaceOwnerProfile!.ResponseRate.Should().Be(100);
        response.Data!.Me!.SpaceOwnerProfile!.AverageResponseTime.Should().BeGreaterOrEqualTo(48);
    }

    private async Task<Booking> SeedBookingWithTimestampsAsync(
        Guid campaignId,
        Guid spaceId,
        DateTime createdAt,
        DateTime updatedAt,
        BookingStatus status) {
        var startDate = DateTime.UtcNow.AddDays(7);
        var endDate = DateTime.UtcNow.AddDays(14);
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
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = pricePerDay,
            InstallationFee = installationFee,
            SubtotalAmount = subtotal,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = platformFeeAmount,
            TotalAmount = subtotal + installationFee + platformFeeAmount,
            OwnerPayoutAmount = subtotal + installationFee,
            CreatedAt = createdAt,
            UpdatedAt = updatedAt
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();
        return booking;
    }
}

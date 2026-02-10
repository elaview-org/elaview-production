using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetMyBookingsAsAdvertiser_ReturnsOwnBookings() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        using (var scope = Fixture.Services.CreateScope()) {
            var context =
                scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var bookings = BookingFactory.CreateMany(campaign.Id, space.Id, 3);
            context.Bookings.AddRange(bookings);
            await context.SaveChangesAsync();
        }

        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>(
            """
            query {
                myBookingsAsAdvertiser(first: 10) {
                    nodes { id status startDate endDate totalDays }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsAdvertiser.Nodes.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetMyBookingsAsOwner_ReturnsBookingsForOwnSpaces() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        using (var scope = Fixture.Services.CreateScope()) {
            var context =
                scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var bookings = BookingFactory.CreateMany(campaign.Id, space.Id, 4);
            context.Bookings.AddRange(bookings);
            await context.SaveChangesAsync();
        }

        var response = await Client.QueryAsync<MyBookingsAsOwnerResponse>("""
            query {
                myBookingsAsOwner(first: 10) {
                    nodes { id status }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsOwner.Nodes.Should().HaveCount(4);
    }

    [Fact]
    public async Task
        GetMyBookingsAsAdvertiser_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>(
            """
            query {
                myBookingsAsAdvertiser(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetMyBookingsAsAdvertiser_WithSearchText_FiltersResults() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        Guid matchingSpaceId, nonMatchingSpaceId;
        using (var scope = Fixture.Services.CreateScope()) {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var matchingSpace = new Space {
                Id = Guid.NewGuid(),
                SpaceOwnerProfileId = ownerProfile.Id,
                Title = "Downtown Coffee Shop",
                Description = "A great space",
                Type = SpaceType.Storefront,
                Status = SpaceStatus.Active,
                Address = "123 Main St",
                City = "New York",
                State = "NY",
                Latitude = 40.7128,
                Longitude = -74.0060,
                PricePerDay = 50.00m,
                MinDuration = 7,
                CreatedAt = DateTime.UtcNow
            };
            var nonMatchingSpace = new Space {
                Id = Guid.NewGuid(),
                SpaceOwnerProfileId = ownerProfile.Id,
                Title = "Airport Terminal",
                Description = "Another space",
                Type = SpaceType.Storefront,
                Status = SpaceStatus.Active,
                Address = "456 Airport Rd",
                City = "New York",
                State = "NY",
                Latitude = 40.7128,
                Longitude = -74.0060,
                PricePerDay = 50.00m,
                MinDuration = 7,
                CreatedAt = DateTime.UtcNow
            };
            context.Spaces.AddRange(matchingSpace, nonMatchingSpace);
            await context.SaveChangesAsync();
            matchingSpaceId = matchingSpace.Id;
            nonMatchingSpaceId = nonMatchingSpace.Id;
        }

        await SeedBookingAsync(campaign.Id, matchingSpaceId);
        await SeedBookingAsync(campaign.Id, nonMatchingSpaceId);

        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>("""
            query($searchText: String) {
                myBookingsAsAdvertiser(first: 10, searchText: $searchText) {
                    nodes { id status }
                }
            }
            """, new { searchText = "coffee" });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsAdvertiser.Nodes.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetMyBookingsAsAdvertiser_WithNoMatchingSearch_ReturnsEmpty() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>("""
            query($searchText: String) {
                myBookingsAsAdvertiser(first: 10, searchText: $searchText) {
                    nodes { id status }
                }
            }
            """, new { searchText = "nonexistent12345" });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsAdvertiser.Nodes.Should().BeEmpty();
    }

    [Fact]
    public async Task GetBookingById_AsParticipant_ReturnsBooking() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.QueryAsync<BookingByIdResponse>("""
                query($id: ID!) {
                    bookingById(id: $id) {
                        id
                        status
                        startDate
                        endDate
                        totalDays
                        pricePerDay
                        subtotalAmount
                        totalAmount
                    }
                }
                """,
            new { id = booking.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.BookingById.Should().NotBeNull();
        response.Data!.BookingById!.Status.Should().Be("PENDING_APPROVAL");
    }
}
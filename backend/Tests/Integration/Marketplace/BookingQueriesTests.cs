using ElaviewBackend.Data;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingQueriesTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetMyBookingsAsAdvertiser_ReturnsOwnBookings() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        using (var scope = Fixture.Services.CreateScope()) {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var bookings = BookingFactory.CreateMany(campaign.Id, space.Id, 3);
            context.Bookings.AddRange(bookings);
            await context.SaveChangesAsync();
        }

        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>("""
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
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
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
    public async Task GetMyBookingsAsAdvertiser_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>("""
            query {
                myBookingsAsAdvertiser(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
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
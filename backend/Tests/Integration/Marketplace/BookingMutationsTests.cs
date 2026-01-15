using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingMutationsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateBooking_AsAdvertiser_CreatesBooking() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space =
            await SeedSpaceWithPricingAsync(ownerProfile.Id, 50.00m, 25.00m);

        var startDate = DateTime.UtcNow.AddDays(7);
        var endDate = DateTime.UtcNow.AddDays(14);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
                mutation($campaignId: ID!, $input: CreateBookingInput!) {
                    createBooking(campaignId: $campaignId, input: $input) {
                        booking {
                            id
                            status
                            totalDays
                            pricePerDay
                            subtotalAmount
                            totalAmount
                        }
                    }
                }
                """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate,
                    endDate
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateBooking.Booking.Status.Should()
            .Be("PENDING_APPROVAL");
        response.Data!.CreateBooking.Booking.TotalDays.Should().Be(7);
    }

    [Fact]
    public async Task CreateBooking_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<CreateBookingResponse>("""
                mutation($campaignId: ID!, $input: CreateBookingInput!) {
                    createBooking(campaignId: $campaignId, input: $input) {
                        booking { id }
                    }
                }
                """,
            new {
                campaignId = Guid.NewGuid(),
                input = new {
                    spaceId = Guid.NewGuid(),
                    startDate = DateTime.UtcNow.AddDays(7),
                    endDate = DateTime.UtcNow.AddDays(14)
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task ApproveBooking_AsOwner_ApprovesBooking() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<ApproveBookingResponse>("""
                mutation($input: ApproveBookingInput!) {
                    approveBooking(input: $input) {
                        booking {
                            id
                            status
                        }
                    }
                }
                """,
            new {
                input = new {
                    id = booking.Id,
                    ownerNotes = "Looking forward to working with you"
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.ApproveBooking.Booking.Status.Should().Be("APPROVED");
    }

    [Fact]
    public async Task CancelBooking_AsAdvertiser_CancelsBooking() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Approved);

        var response = await Client.MutateAsync<CancelBookingResponse>("""
                mutation($input: CancelBookingInput!) {
                    cancelBooking(input: $input) {
                        booking {
                            id
                            status
                        }
                    }
                }
                """,
            new { input = new { id = booking.Id, reason = "Changed plans" } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CancelBooking.Booking.Status.Should().Be("CANCELLED");
    }
}
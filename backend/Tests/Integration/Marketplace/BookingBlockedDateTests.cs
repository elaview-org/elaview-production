using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingBlockedDateTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateBooking_OnBlockedDates_ReturnsConflictError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDatesAsync(space.Id, startDate, 5);

        var bookingStartDate = DateTime.UtcNow.AddDays(15);
        var bookingEndDate = DateTime.UtcNow.AddDays(22);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = bookingStartDate,
                    endDate = bookingEndDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ConflictError");
    }

    [Fact]
    public async Task CreateBooking_BlockedDateAtStartOfRange_ReturnsConflictError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var blockedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDateAsync(space.Id, blockedDate);

        var bookingStartDate = DateTime.UtcNow.AddDays(14);
        var bookingEndDate = DateTime.UtcNow.AddDays(21);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = bookingStartDate,
                    endDate = bookingEndDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ConflictError");
    }

    [Fact]
    public async Task CreateBooking_BlockedDateAtEndOfRange_ReturnsConflictError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var blockedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(20));
        await SeedBlockedDateAsync(space.Id, blockedDate);

        var bookingStartDate = DateTime.UtcNow.AddDays(14);
        var bookingEndDate = DateTime.UtcNow.AddDays(21);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = bookingStartDate,
                    endDate = bookingEndDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ConflictError");
    }

    [Fact]
    public async Task CreateBooking_NoBlockedDatesInRange_Succeeds() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var blockedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30));
        await SeedBlockedDateAsync(space.Id, blockedDate);

        var bookingStartDate = DateTime.UtcNow.AddDays(14);
        var bookingEndDate = DateTime.UtcNow.AddDays(21);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = bookingStartDate,
                    endDate = bookingEndDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateBooking.Booking.Should().NotBeNull();
        response.Data!.CreateBooking.Booking.Status.Should().Be("PENDING_APPROVAL");
    }

    [Fact]
    public async Task CreateBooking_BlockedDateOutsideRange_Succeeds() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var blockedDateBefore = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10));
        var blockedDateAfter = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(25));
        await SeedBlockedDateAsync(space.Id, blockedDateBefore);
        await SeedBlockedDateAsync(space.Id, blockedDateAfter);

        var bookingStartDate = DateTime.UtcNow.AddDays(14);
        var bookingEndDate = DateTime.UtcNow.AddDays(21);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = bookingStartDate,
                    endDate = bookingEndDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateBooking.Booking.Should().NotBeNull();
    }
}

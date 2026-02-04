using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingValidationTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateBooking_StartDateInPast_ReturnsValidationError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

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
                    startDate = DateTime.UtcNow.AddDays(-1),
                    endDate = DateTime.UtcNow.AddDays(7)
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task CreateBooking_EndBeforeStart_ReturnsValidationError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

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
                    startDate = DateTime.UtcNow.AddDays(14),
                    endDate = DateTime.UtcNow.AddDays(7)
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task CreateBooking_ZeroDuration_ReturnsValidationError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var sameDate = DateTime.UtcNow.AddDays(7);
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
                    startDate = sameDate,
                    endDate = sameDate
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task CreateBooking_BelowMinDuration_ReturnsValidationError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceWithMinDurationAsync(ownerProfile.Id, 14);

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
                    startDate = DateTime.UtcNow.AddDays(7),
                    endDate = DateTime.UtcNow.AddDays(14)
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task CreateBooking_NonexistentCampaign_ReturnsNotFound() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                    errors { __typename }
                }
            }
            """,
            new {
                campaignId = Guid.NewGuid(),
                input = new {
                    spaceId = space.Id,
                    startDate = DateTime.UtcNow.AddDays(7),
                    endDate = DateTime.UtcNow.AddDays(14)
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("NotFoundError");
    }

    [Fact]
    public async Task CreateBooking_NonexistentSpace_ReturnsNotFound() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

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
                    spaceId = Guid.NewGuid(),
                    startDate = DateTime.UtcNow.AddDays(7),
                    endDate = DateTime.UtcNow.AddDays(14)
                }
            });

        response.Data!.CreateBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreateBooking.Errors!.First().TypeName.Should().Be("NotFoundError");
    }
}

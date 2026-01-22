using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class SpaceValidationTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task DeactivateSpace_WithActiveBooking_ReturnsConflict() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Approved);

        var response = await Client.MutateAsync<DeactivateSpaceResponse>("""
            mutation($input: DeactivateSpaceInput!) {
                deactivateSpace(input: $input) {
                    space { id status }
                }
            }
            """, new { input = new { id = space.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("CONFLICT");
    }

    [Fact]
    public async Task DeleteSpace_WithActiveBooking_ReturnsConflict() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Paid);

        var response = await Client.MutateAsync<DeleteSpaceResponse>("""
            mutation($input: DeleteSpaceInput!) {
                deleteSpace(input: $input) {
                    success
                }
            }
            """, new { input = new { id = space.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("CONFLICT");
    }

    [Fact]
    public async Task CreateBooking_OnInactiveSpace_ReturnsForbidden() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceWithStatusAsync(ownerProfile.Id,
            SpaceStatus.Inactive);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
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

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task CreateBooking_OverlappingDates_ReturnsConflict() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        await SeedBookingWithDatesAsync(
            campaign.Id, space.Id,
            DateTime.UtcNow.AddDays(10),
            DateTime.UtcNow.AddDays(20),
            BookingStatus.Approved);

        var response = await Client.MutateAsync<CreateBookingResponse>("""
            mutation($campaignId: ID!, $input: CreateBookingInput!) {
                createBooking(campaignId: $campaignId, input: $input) {
                    booking { id }
                }
            }
            """,
            new {
                campaignId = campaign.Id,
                input = new {
                    spaceId = space.Id,
                    startDate = DateTime.UtcNow.AddDays(15),
                    endDate = DateTime.UtcNow.AddDays(25)
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("CONFLICT");
    }

    [Fact]
    public async Task CreateSpace_NegativePrice_ReturnsValidationError() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.MutateAsync<CreateSpaceResponse>("""
            mutation($input: CreateSpaceInput!) {
                createSpace(input: $input) {
                    space { id }
                }
            }
            """,
            new {
                input = new {
                    title = "Test Space",
                    type = "STOREFRONT",
                    address = "123 Main St",
                    city = "New York",
                    state = "NY",
                    latitude = 40.7128,
                    longitude = -74.0060,
                    pricePerDay = -50.00m,
                    minDuration = 7
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task UpdateSpace_NegativePrice_ReturnsValidationError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<UpdateSpaceResponse>("""
            mutation($id: ID!, $input: UpdateSpaceInput!) {
                updateSpace(id: $id, input: $input) {
                    space { id pricePerDay }
                }
            }
            """,
            new {
                id = space.Id,
                input = new { pricePerDay = -100.00m }
            });

        response.Errors.Should().NotBeNullOrEmpty();
    }
}
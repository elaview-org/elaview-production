using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class PaginationEdgeCaseTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetSpaces_NoMatches_ReturnsEmptyConnection() {
        var response = await Client.QueryAsync<SpacesResponse>("""
            query {
                spaces(where: { city: { eq: "NonexistentCity12345" } }) {
                    nodes { id title }
                    pageInfo { hasNextPage hasPreviousPage }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Spaces.Nodes.Should().BeEmpty();
        response.Data!.Spaces.TotalCount.Should().Be(0);
        response.Data!.Spaces.PageInfo.HasNextPage.Should().BeFalse();
        response.Data!.Spaces.PageInfo.HasPreviousPage.Should().BeFalse();
    }

    [Fact]
    public async Task GetSpaces_FilterAndSort_CombinesCorrectly() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await SeedSpaceWithPropertiesAsync(ownerProfile.Id, "TestCity", 100.00m);
        await SeedSpaceWithPropertiesAsync(ownerProfile.Id, "TestCity", 50.00m);
        await SeedSpaceWithPropertiesAsync(ownerProfile.Id, "OtherCity", 75.00m);

        var response = await Client.QueryAsync<SpacesResponse>("""
            query {
                spaces(
                    where: { city: { eq: "TestCity" } }
                    order: [{ pricePerDay: ASC }]
                ) {
                    nodes { id city pricePerDay }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Spaces.TotalCount.Should().Be(2);
        response.Data!.Spaces.Nodes.Should().HaveCount(2);
        response.Data!.Spaces.Nodes.First().PricePerDay.Should().Be(50.00m);
        response.Data!.Spaces.Nodes.Last().PricePerDay.Should().Be(100.00m);
    }

    [Fact]
    public async Task GetBookings_AsAdvertiser_ReturnsOnlyOwn() {
        var (advertiser1, advertiserProfile1) = await SeedAdvertiserAsync();
        var (advertiser2, advertiserProfile2) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign1 = await SeedCampaignAsync(advertiserProfile1.Id);
        var campaign2 = await SeedCampaignAsync(advertiserProfile2.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);

        await SeedBookingAsync(campaign1.Id, space.Id);
        await SeedBookingAsync(campaign1.Id, space.Id);
        await SeedBookingAsync(campaign2.Id, space.Id);

        await LoginAsync(advertiser1.Email, "Test123!");

        var response = await Client.QueryAsync<MyBookingsAsAdvertiserResponse>("""
            query {
                myBookingsAsAdvertiser {
                    nodes { id }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsAdvertiser.TotalCount.Should().Be(2);
        response.Data!.MyBookingsAsAdvertiser.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetBookings_AsOwner_ReturnsOnlyOwn() {
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (owner1, ownerProfile1) = await SeedSpaceOwnerAsync();
        var (owner2, ownerProfile2) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space1 = await SeedSpaceAsync(ownerProfile1.Id);
        var space2 = await SeedSpaceAsync(ownerProfile2.Id);

        await SeedBookingAsync(campaign.Id, space1.Id);
        await SeedBookingAsync(campaign.Id, space1.Id);
        await SeedBookingAsync(campaign.Id, space2.Id);
        await SeedBookingAsync(campaign.Id, space2.Id);
        await SeedBookingAsync(campaign.Id, space2.Id);

        await LoginAsync(owner1.Email, "Test123!");

        var response = await Client.QueryAsync<MyBookingsAsOwnerResponse>("""
            query {
                myBookingsAsOwner {
                    nodes { id }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyBookingsAsOwner.TotalCount.Should().Be(2);
        response.Data!.MyBookingsAsOwner.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetSpaces_WithPagination_ReturnsCorrectPage() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await SeedSpacesAsync(ownerProfile.Id, 15);

        var response = await Client.QueryAsync<SpacesResponse>("""
            query {
                spaces(first: 5) {
                    nodes { id }
                    pageInfo { hasNextPage hasPreviousPage endCursor }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Spaces.TotalCount.Should().BeGreaterOrEqualTo(15);
        response.Data!.Spaces.Nodes.Should().HaveCount(5);
        response.Data!.Spaces.PageInfo.HasNextPage.Should().BeTrue();
    }
}
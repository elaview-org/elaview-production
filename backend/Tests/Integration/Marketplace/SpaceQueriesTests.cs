using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class SpaceQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetSpaces_Authenticated_ReturnsPaginatedSpaces() {
        await CreateAndLoginUserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await SeedSpacesAsync(ownerProfile.Id, 15);

        var response = await Client.QueryAsync<SpacesResponse>("""
            query {
                spaces(first: 10) {
                    nodes { id title type status pricePerDay }
                    pageInfo { hasNextPage hasPreviousPage }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Spaces.Nodes.Should().HaveCount(10);
        response.Data!.Spaces.PageInfo.HasNextPage.Should().BeTrue();
    }

    [Fact]
    public async Task GetSpaces_Unauthenticated_ReturnsSpaces() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await SeedSpacesAsync(ownerProfile.Id, 5);

        var response = await Client.QueryAsync<SpacesResponse>("""
            query {
                spaces(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Spaces.Nodes.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetSpaceById_Authenticated_ReturnsSpace() {
        await CreateAndLoginUserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.QueryAsync<SpaceByIdResponse>("""
                query($id: ID!) {
                    spaceById(id: $id) {
                        id
                        title
                        description
                        type
                        status
                        address
                        city
                        state
                        pricePerDay
                        installationFee
                        minDuration
                    }
                }
                """,
            new { id = space.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SpaceById.Should().NotBeNull();
        response.Data!.SpaceById!.Title.Should().Be(space.Title);
        response.Data!.SpaceById!.PricePerDay.Should().Be(space.PricePerDay);
    }

    [Fact]
    public async Task GetSpaceById_NonexistentSpace_ReturnsNull() {
        await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<SpaceByIdResponse>("""
                query($id: ID!) {
                    spaceById(id: $id) {
                        id
                    }
                }
                """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SpaceById.Should().BeNull();
    }

    [Fact]
    public async Task GetMySpaces_AsSpaceOwner_ReturnsOwnSpaces() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        await SeedSpacesAsync(ownerProfile.Id, 5);

        var (_, otherProfile) = await SeedSpaceOwnerAsync();
        await SeedSpacesAsync(otherProfile.Id, 3);

        var response = await Client.QueryAsync<MySpacesResponse>("""
            query {
                mySpaces(first: 10) {
                    nodes { id title }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySpaces.Nodes.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetMySpaces_AsAdvertiser_ReturnsEmpty() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.QueryAsync<MySpacesResponse>("""
            query {
                mySpaces(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySpaces.Nodes.Should().BeEmpty();
    }
}
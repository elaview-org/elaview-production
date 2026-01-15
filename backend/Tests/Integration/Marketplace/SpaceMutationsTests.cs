using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class SpaceMutationsTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateSpace_AsSpaceOwner_CreatesSpace() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.MutateAsync<CreateSpaceResponse>("""
            mutation($input: CreateSpaceInput!) {
                createSpace(input: $input) {
                    space {
                        id
                        title
                        description
                        type
                        status
                        address
                        city
                        state
                        pricePerDay
                        minDuration
                    }
                }
            }
            """,
            new {
                input = new {
                    title = "Test Space",
                    description = "A test space for advertising",
                    type = "STOREFRONT",
                    address = "123 Main St",
                    city = "New York",
                    state = "NY",
                    latitude = 40.7128,
                    longitude = -74.0060,
                    pricePerDay = 50.00m,
                    minDuration = 7
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateSpace.Space.Title.Should().Be("Test Space");
        response.Data!.CreateSpace.Space.PricePerDay.Should().Be(50.00m);
        response.Data!.CreateSpace.Space.Status.Should().Be("ACTIVE");
    }

    [Fact]
    public async Task CreateSpace_Unauthenticated_ReturnsAuthError() {
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
                    pricePerDay = 50.00m,
                    minDuration = 7
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task UpdateSpace_AsOwner_UpdatesSpace() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<UpdateSpaceResponse>("""
            mutation($id: ID!, $input: UpdateSpaceInput!) {
                updateSpace(id: $id, input: $input) {
                    space {
                        id
                        title
                        pricePerDay
                    }
                }
            }
            """,
            new {
                id = space.Id,
                input = new {
                    title = "Updated Title",
                    pricePerDay = 75.00m
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdateSpace.Space.Title.Should().Be("Updated Title");
        response.Data!.UpdateSpace.Space.PricePerDay.Should().Be(75.00m);
    }

    [Fact]
    public async Task DeleteSpace_AsOwner_DeletesSpace() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<DeleteSpaceResponse>("""
            mutation($input: DeleteSpaceInput!) {
                deleteSpace(input: $input) {
                    success
                }
            }
            """,
            new { input = new { id = space.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.DeleteSpace.Success.Should().BeTrue();
    }

    [Fact]
    public async Task DeactivateSpace_AsOwner_DeactivatesSpace() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<DeactivateSpaceResponse>("""
            mutation($input: DeactivateSpaceInput!) {
                deactivateSpace(input: $input) {
                    space {
                        id
                        status
                    }
                }
            }
            """,
            new { input = new { id = space.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.DeactivateSpace.Space.Status.Should().Be("INACTIVE");
    }

    [Fact]
    public async Task ReactivateSpace_AsOwner_ReactivatesSpace() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceWithStatusAsync(ownerProfile.Id, SpaceStatus.Inactive);

        var response = await Client.MutateAsync<ReactivateSpaceResponse>("""
            mutation($input: ReactivateSpaceInput!) {
                reactivateSpace(input: $input) {
                    space {
                        id
                        status
                    }
                }
            }
            """,
            new { input = new { id = space.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.ReactivateSpace.Space.Status.Should().Be("ACTIVE");
    }
}
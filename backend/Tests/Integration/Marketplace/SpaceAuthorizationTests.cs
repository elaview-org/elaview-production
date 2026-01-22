using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class SpaceAuthorizationTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task UpdateSpace_AsNonOwner_ReturnsForbidden() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var otherUser = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<UpdateSpaceResponse>("""
            mutation($id: ID!, $input: UpdateSpaceInput!) {
                updateSpace(id: $id, input: $input) {
                    space { id title }
                }
            }
            """,
            new {
                id = space.Id,
                input = new { title = "Hijacked Title" }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("FORBIDDEN");
    }

    [Fact]
    public async Task DeleteSpace_AsNonOwner_ReturnsForbidden() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var otherUser = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<DeleteSpaceResponse>("""
            mutation($input: DeleteSpaceInput!) {
                deleteSpace(input: $input) {
                    success
                }
            }
            """, new { input = new { id = space.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("FORBIDDEN");
    }

    [Fact]
    public async Task DeactivateSpace_AsNonOwner_ReturnsForbidden() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var otherUser = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<DeactivateSpaceResponse>("""
            mutation($input: DeactivateSpaceInput!) {
                deactivateSpace(input: $input) {
                    space { id status }
                }
            }
            """, new { input = new { id = space.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("FORBIDDEN");
    }
}
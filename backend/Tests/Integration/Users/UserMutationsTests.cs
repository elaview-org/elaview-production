using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Users;

[Collection("Integration")]
public sealed class UserMutationsTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task UpdateCurrentUser_ValidInput_UpdatesUser() {
        await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<UpdateCurrentUserResponse>("""
            mutation($input: UpdateCurrentUserInput!) {
                updateCurrentUser(input: $input) {
                    user {
                        id
                        name
                        phone
                    }
                }
            }
            """,
            new { input = new { input = new { name = "Updated Name", phone = "+1234567890" } } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdateCurrentUser.User.Name.Should().Be("Updated Name");
        response.Data!.UpdateCurrentUser.User.Phone.Should().Be("+1234567890");
    }

    [Fact]
    public async Task UpdateCurrentUser_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<UpdateCurrentUserResponse>("""
            mutation($input: UpdateCurrentUserInput!) {
                updateCurrentUser(input: $input) {
                    user { id }
                }
            }
            """,
            new { input = new { input = new { name = "Updated Name" } } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task SwitchProfileType_ToSpaceOwner_SwitchesProfile() {
        await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<SwitchProfileTypeResponse>("""
            mutation($input: SwitchProfileTypeInput!) {
                switchProfileType(input: $input) {
                    user {
                        id
                        activeProfileType
                    }
                }
            }
            """,
            new { input = new { type = "SPACE_OWNER" } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SwitchProfileType.User.ActiveProfileType.Should().Be("SPACE_OWNER");
    }

    [Fact]
    public async Task SwitchProfileType_ToAdvertiser_SwitchesProfile() {
        await CreateAndLoginUserAsync(u => u.ActiveProfileType = ProfileType.SpaceOwner);

        var response = await Client.MutateAsync<SwitchProfileTypeResponse>("""
            mutation($input: SwitchProfileTypeInput!) {
                switchProfileType(input: $input) {
                    user {
                        id
                        activeProfileType
                    }
                }
            }
            """,
            new { input = new { type = "ADVERTISER" } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SwitchProfileType.User.ActiveProfileType.Should().Be("ADVERTISER");
    }

    [Fact]
    public async Task SwitchProfileType_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<SwitchProfileTypeResponse>("""
            mutation($input: SwitchProfileTypeInput!) {
                switchProfileType(input: $input) {
                    user { id }
                }
            }
            """,
            new { input = new { type = "SPACE_OWNER" } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task DeleteUser_AsAdmin_DeletesUser() {
        await LoginAsAdminAsync();
        var user = await SeedUserAsync();

        var response = await Client.MutateAsync<DeleteUserPayloadResponse>("""
            mutation($input: DeleteUserInput!) {
                deleteUser(input: $input) {
                    boolean
                }
            }
            """,
            new { input = new { id = user.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.DeleteUser.Boolean.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteUser_AsRegularUser_ReturnsForbidden() {
        await CreateAndLoginUserAsync();
        var otherUser = await SeedUserAsync();

        var response = await Client.MutateAsync<DeleteUserPayloadResponse>("""
            mutation($input: DeleteUserInput!) {
                deleteUser(input: $input) {
                    boolean
                }
            }
            """,
            new { input = new { id = otherUser.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHORIZED");
    }
}
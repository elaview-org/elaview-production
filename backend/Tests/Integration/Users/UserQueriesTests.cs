using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Users;

[Collection("Integration")]
public sealed class UserQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetCurrentUser_Authenticated_ReturnsUser() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<CurrentUserResponse>("""
            query {
                currentUser {
                    id
                    email
                    name
                    role
                    status
                    activeProfileType
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data.Should().NotBeNull();
        response.Data!.CurrentUser.Should().NotBeNull();
        response.Data!.CurrentUser!.Email.Should().Be(user.Email);
        response.Data!.CurrentUser!.Name.Should().Be(user.Name);
    }

    [Fact]
    public async Task GetCurrentUser_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<CurrentUserResponse>("""
            query {
                currentUser {
                    id
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task GetUsers_AsAdmin_ReturnsPaginatedUsers() {
        await LoginAsAdminAsync();
        await SeedUsersAsync(15);

        var response = await Client.QueryAsync<UsersResponse>("""
            query {
                users(first: 10) {
                    nodes { id email name role status }
                    pageInfo { hasNextPage hasPreviousPage }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Users.Nodes.Should().HaveCount(10);
        response.Data!.Users.PageInfo.HasNextPage.Should().BeTrue();
    }

    [Fact]
    public async Task GetUsers_AsRegularUser_ReturnsForbidden() {
        await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<UsersResponse>("""
            query {
                users(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHORIZED");
    }

    [Fact]
    public async Task GetUserById_AsAdmin_ReturnsUser() {
        var admin = await LoginAsAdminAsync();
        var user = await SeedUserAsync();

        var response = await Client.QueryAsync<UserByIdResponse>("""
                query($id: ID!) {
                    userById(id: $id) {
                        id
                        email
                        name
                    }
                }
                """,
            new { id = user.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UserById.Should().NotBeNull();
        response.Data!.UserById!.Email.Should().Be(user.Email);
    }

    [Fact]
    public async Task GetUserById_AsRegularUser_ReturnsForbidden() {
        await CreateAndLoginUserAsync();
        var otherUser = await SeedUserAsync();

        var response = await Client.QueryAsync<UserByIdResponse>("""
                query($id: ID!) {
                    userById(id: $id) {
                        id
                    }
                }
                """,
            new { id = otherUser.Id });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHORIZED");
    }

    [Fact]
    public async Task GetUserById_NonexistentUser_ReturnsNull() {
        await LoginAsAdminAsync();

        var response = await Client.QueryAsync<UserByIdResponse>("""
                query($id: ID!) {
                    userById(id: $id) {
                        id
                    }
                }
                """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UserById.Should().BeNull();
    }
}
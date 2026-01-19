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
    public async Task GetMe_Authenticated_ReturnsUser() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<MeResponse>("""
            query {
                me {
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
        response.Data!.Me.Should().NotBeNull();
        response.Data!.Me!.Email.Should().Be(user.Email);
        response.Data!.Me!.Name.Should().Be(user.Name);
    }

    [Fact]
    public async Task GetMe_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MeResponse>("""
            query {
                me {
                    id
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

}
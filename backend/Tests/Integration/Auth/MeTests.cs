using System.Net;
using System.Net.Http.Json;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Auth;

[Collection("Integration")]
public sealed class MeTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task Me_Authenticated_ReturnsCurrentUser() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<AuthMeResponse>();
        body!.Email.Should().Be(user.Email);
        body.Name.Should().Be(user.Name);
    }

    [Fact]
    public async Task Me_Unauthenticated_ReturnsUnauthorized() {
        var response = await Client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Me_AfterLogout_ReturnsUnauthorized() {
        await CreateAndLoginUserAsync();
        await LogoutAsync();

        var response = await Client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
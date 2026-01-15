using System.Net;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Auth;

[Collection("Integration")]
public sealed class LogoutTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task Logout_Authenticated_ReturnsOk() {
        await CreateAndLoginUserAsync();

        var response = await Client.PostAsync("/api/auth/logout", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<LogoutResponse>();
        body!.Message.Should().Be("Logout successful");
    }

    [Fact]
    public async Task Logout_Unauthenticated_ReturnsOk() {
        var response = await Client.PostAsync("/api/auth/logout", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Logout_ClearsAuthCookie() {
        await CreateAndLoginUserAsync();

        var logoutResponse = await Client.PostAsync("/api/auth/logout", null);
        logoutResponse.EnsureSuccessStatusCode();

        var meResponse = await Client.GetAsync("/api/auth/me");

        meResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
using System.Net;
using System.Net.Http.Json;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Auth;

[Collection("Integration")]
public sealed class LoginTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithCookie() {
        await SeedUserAsync("test@example.com", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "test@example.com",
            password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Should().ContainKey("Set-Cookie");
        response.Headers.GetValues("Set-Cookie")
            .Should().Contain(c => c.StartsWith("ElaviewAuth="));

        var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
        body!.Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized() {
        await SeedUserAsync("test@example.com", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "test@example.com",
            password = "WrongPassword"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_NonexistentUser_ReturnsUnauthorized() {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "nonexistent@example.com",
            password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_MissingEmail_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_MissingPassword_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "test@example.com"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_InvalidEmailFormat_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "not-an-email",
            password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("", "Password123!")]
    [InlineData("valid@email.com", "")]
    [InlineData("", "")]
    public async Task Login_EmptyCredentials_ReturnsBadRequest(string email, string password) {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email,
            password
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
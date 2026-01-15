using System.Net;
using System.Net.Http.Json;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Auth;

[Collection("Integration")]
public sealed class SignupTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task Signup_ValidInput_CreatesUserAndReturnsOk() {
        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            email = "newuser@example.com",
            password = "SecurePass123!",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Should().ContainKey("Set-Cookie");

        var body = await response.Content.ReadFromJsonAsync<SignupResponse>();
        body!.Email.Should().Be("newuser@example.com");
        body.Name.Should().Be("New User");
    }

    [Fact]
    public async Task Signup_DuplicateEmail_ReturnsConflict() {
        await SeedUserAsync("existing@example.com", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            email = "existing@example.com",
            password = "SecurePass123!",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Signup_WeakPassword_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            email = "newuser@example.com",
            password = "weak",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Signup_InvalidEmail_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            email = "not-an-email",
            password = "SecurePass123!",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Signup_MissingEmail_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            password = "SecurePass123!",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Signup_MissingPassword_ReturnsBadRequest() {
        var response = await Client.PostAsJsonAsync("/api/auth/signup", new {
            email = "newuser@example.com",
            name = "New User"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
namespace ElaviewBackend.Tests.Shared.Models;

public record LoginResponse(string Id, string Email, string? Name, int Role, string Message);

public record SignupResponse(string Id, string Email, string? Name, int Role, string Message);

public record LogoutResponse(string Message);

public record AuthMeResponse(string Id, string Email, string? Name, int Role, string Message);
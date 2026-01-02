using System.Security.Claims;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using ElaviewBackend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ElaviewBackend.Controllers;

public class AuthControllerTests {
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerTests() {
        _mockAuthService = new Mock<IAuthService>(MockBehavior.Strict);
        var mockAuthenticationService = new Mock<IAuthenticationService>();

        _controller = new AuthController(_mockAuthService.Object);

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock
            .Setup(sp => sp.GetService(typeof(IAuthenticationService)))
            .Returns(mockAuthenticationService.Object);

        _controller.ControllerContext = new ControllerContext {
            HttpContext = new DefaultHttpContext {
                RequestServices = serviceProviderMock.Object
            }
        };
    }

    [Fact]
    public async Task Signup_WithValidData_ReturnsOkWithLoginResponse() {
        var request = new SignupRequest {
            Email = "test@example.com",
            Password = "password123",
            Name = "Test User"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Name = request.Name,
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password,
                request.Name))
            .ReturnsAsync(user);

        var result = await _controller.Signup(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(user.Id, response.Id);
        Assert.Equal(user.Email, response.Email);
        Assert.Equal(user.Name, response.Name);
        Assert.Equal(user.Role, response.Role);
        Assert.Equal("Signup successful", response.Message);
    }

    [Fact]
    public async Task Signup_WithValidDataWithoutName_ReturnsOkWithLoginResponse() {
        var request = new SignupRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password, null))
            .ReturnsAsync(user);

        var result = await _controller.Signup(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(user.Id, response.Id);
        Assert.Equal(user.Email, response.Email);
        Assert.Null(response.Name);
        Assert.Equal(user.Role, response.Role);
        Assert.Equal("Signup successful", response.Message);
    }

    [Fact]
    public async Task Signup_WithDuplicateEmail_ReturnsConflict() {
        var request = new SignupRequest {
            Email = "existing@example.com",
            Password = "password123"
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password, null))
            .ReturnsAsync((User?)null);

        var result = await _controller.Signup(request);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        dynamic value = conflictResult.Value!;
        Assert.Equal("Email already exists", value.message);
    }

    [Fact]
    public async Task Signup_WithDuplicateEmail_ReturnsConflictStatusCode() {
        var request = new SignupRequest {
            Email = "existing@example.com",
            Password = "password123"
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password, null))
            .ReturnsAsync((User?)null);

        var result = await _controller.Signup(request);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(409, conflictResult.StatusCode);
    }

    [Fact]
    public async Task Signup_WithSpaceOwnerRole_ReturnsCorrectRole() {
        var request = new SignupRequest {
            Email = "owner@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.SpaceOwner,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password, null))
            .ReturnsAsync(user);

        var result = await _controller.Signup(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.SpaceOwner, response.Role);
    }

    [Fact]
    public async Task Signup_ReturnsOkStatusCode() {
        var request = new SignupRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.CreateUserAsync(request.Email, request.Password, null))
            .ReturnsAsync(user);

        var result = await _controller.Signup(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkWithLoginResponse() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Name = "Test User",
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(user.Id, response.Id);
        Assert.Equal(user.Email, response.Email);
        Assert.Equal("Login successful", response.Message);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "wrongpassword"
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync((User?)null);

        var result = await _controller.Login(request);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        dynamic value = unauthorizedResult.Value!;
        Assert.Equal("Invalid email or password", value.message);
    }

    [Fact]
    public async Task Login_WithValidCredentialsWithoutName_ReturnsOkWithLoginResponse() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(user.Id, response.Id);
        Assert.Null(response.Name);
    }

    [Fact]
    public async Task Login_WithInactiveUser_ReturnsUnauthorized() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Suspended
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        dynamic value = unauthorizedResult.Value!;
        Assert.Equal("Account is not active", value.message);
    }

    [Fact]
    public async Task Login_WithDeletedUser_ReturnsUnauthorized() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Deleted
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        dynamic value = unauthorizedResult.Value!;
        Assert.Equal("Account is not active", value.message);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorizedStatusCode() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "wrongpassword"
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync((User?)null);

        var result = await _controller.Login(request);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
    }

    [Fact]
    public async Task Login_WithAdminRole_ReturnsCorrectRole() {
        var request = new LoginRequest {
            Email = "admin@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Admin,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.Admin, response.Role);
    }

    [Fact]
    public async Task Login_WithSpaceOwnerRole_ReturnsCorrectRole() {
        var request = new LoginRequest {
            Email = "owner@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.SpaceOwner,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.SpaceOwner, response.Role);
    }

    [Fact]
    public async Task Login_WithMarketingRole_ReturnsCorrectRole() {
        var request = new LoginRequest {
            Email = "marketing@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Marketing,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.Marketing, response.Role);
    }

    [Fact]
    public async Task Login_ReturnsOkStatusCode() {
        var request = new LoginRequest {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User {
            Id = "user-123",
            Email = request.Email,
            Role = UserRole.Advertiser,
            Status = UserStatus.Active
        };

        _mockAuthService
            .Setup(s => s.ValidateUserAsync(request.Email, request.Password))
            .ReturnsAsync(user);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public async Task Logout_ReturnsOk() {
        var result = await _controller.Logout();

        var okResult = Assert.IsType<OkObjectResult>(result);
        dynamic value = okResult.Value!;
        Assert.Equal("Logout successful", value.message);
    }

    [Fact]
    public async Task Logout_ReturnsOkStatusCode() {
        var result = await _controller.Logout();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public void GetCurrentUser_WhenAuthenticated_ReturnsOkWithLoginResponse() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "test@example.com"),
            new(ClaimTypes.Name, "Test User"),
            new(ClaimTypes.Role, "Advertiser")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal("user-123", response.Id);
        Assert.Equal("test@example.com", response.Email);
        Assert.Equal("Test User", response.Name);
        Assert.Equal(UserRole.Advertiser, response.Role);
        Assert.Equal("Authenticated", response.Message);
    }

    [Fact]
    public void GetCurrentUser_WhenAuthenticatedWithoutName_ReturnsOkWithLoginResponse() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "test@example.com"),
            new(ClaimTypes.Role, "Advertiser")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal("user-123", response.Id);
        Assert.Null(response.Name);
    }

    [Fact]
    public void GetCurrentUser_WithAdminRole_ReturnsCorrectRole() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "admin@example.com"),
            new(ClaimTypes.Role, "Admin")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.Admin, response.Role);
    }

    [Fact]
    public void GetCurrentUser_WithSpaceOwnerRole_ReturnsCorrectRole() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "owner@example.com"),
            new(ClaimTypes.Role, "SpaceOwner")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.SpaceOwner, response.Role);
    }

    [Fact]
    public void GetCurrentUser_WithMarketingRole_ReturnsCorrectRole() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "marketing@example.com"),
            new(ClaimTypes.Role, "Marketing")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal(UserRole.Marketing, response.Role);
    }

    [Fact]
    public void GetCurrentUser_WhenAuthenticated_ReturnsOkStatusCode() {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, "user-123"),
            new(ClaimTypes.Email, "test@example.com"),
            new(ClaimTypes.Role, "Advertiser")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext.HttpContext.User = claimsPrincipal;

        var result = _controller.GetCurrentUser();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public void GetCurrentUser_WhenNotAuthenticated_ReturnsUnauthorized() {
        _controller.ControllerContext.HttpContext.User =
            new ClaimsPrincipal(new ClaimsIdentity());

        var result = _controller.GetCurrentUser();

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        dynamic value = unauthorizedResult.Value!;
        Assert.Equal("Not authenticated", value.message);
    }

    [Fact]
    public void GetCurrentUser_WhenNotAuthenticated_ReturnsUnauthorizedStatusCode() {
        _controller.ControllerContext.HttpContext.User =
            new ClaimsPrincipal(new ClaimsIdentity());

        var result = _controller.GetCurrentUser();

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
    }
}
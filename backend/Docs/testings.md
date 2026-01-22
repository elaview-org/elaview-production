# Testing Specification

Complete specification for Elaview backend testing including unit tests, integration tests, fixtures, factories, and
best practices.

---

## Architecture Overview

### Testing Philosophy

**No Mocks for Infrastructure**: Use real databases, real services, real GraphQL execution. Mocks hide bugs that only
appear in production (mapping errors, migration issues, query translation failures).

**Test Isolation**: Each test runs against a clean database state. Respawn resets data between tests without recreating
schema.

**Shared Factories**: Same factories used for seeding and testing ensures consistency.

### Directory Structure

```
Tests/
├── Unit/
│   ├── Users/
│   ├── Marketplace/
│   ├── Payments/
│   └── Notifications/
├── Integration/
│   ├── Auth/                 # REST auth tests
│   ├── Users/                # User GraphQL tests
│   ├── Marketplace/          # Space, Campaign, Booking, Review tests
│   └── Fixtures/
└── Shared/
    ├── Factories/
    ├── Extensions/
    └── Models/
```

### Test Categories

| Category    | Scope                       | Database | Speed  | When to Use                            |
|-------------|-----------------------------|----------|--------|----------------------------------------|
| Unit        | Single class/method         | No       | Fast   | Pure business logic, calculations      |
| Integration | Multiple components + DB    | Real     | Medium | Service layer, repositories, GraphQL   |
| E2E         | Full system + external APIs | Real     | Slow   | Critical user flows, payment scenarios |

---

## Dependencies

```xml
<PackageReference Include="xunit" Version="2.9.*" />
<PackageReference Include="xunit.runner.visualstudio" Version="2.8.*" />
<PackageReference Include="FluentAssertions" Version="7.*" />
<PackageReference Include="Bogus" Version="35.*" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="10.*" />
<PackageReference Include="Testcontainers.PostgreSql" Version="4.*" />
<PackageReference Include="Respawn" Version="6.*" />
```

| Package                          | Purpose                                     |
|----------------------------------|---------------------------------------------|
| xUnit                            | Test framework with per-test instantiation  |
| FluentAssertions                 | Readable assertion syntax                   |
| Bogus                            | Fake data generation                        |
| Microsoft.AspNetCore.Mvc.Testing | WebApplicationFactory for in-memory hosting |
| Testcontainers.PostgreSql        | Real PostgreSQL in Docker                   |
| Respawn                          | Fast database cleanup between tests         |

---

## Integration Test Fixture

### WebApplicationFactory Setup

```csharp
public sealed class IntegrationTestFixture : WebApplicationFactory<IApiMarker>, IAsyncLifetime {
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:17")
        .WithDatabase("elaview_test")
        .WithUsername("test")
        .WithPassword("test")
        .Build();

    private NpgsqlConnection _dbConnection = null!;
    private Respawner _respawner = null!;

    public HttpClient HttpClient { get; private set; } = null!;

    public async Task InitializeAsync() {
        await _dbContainer.StartAsync();

        Environment.SetEnvironmentVariable("DATABASE_HOST", _dbContainer.Hostname);
        Environment.SetEnvironmentVariable("DATABASE_PORT", _dbContainer.GetMappedPublicPort(5432).ToString());
        Environment.SetEnvironmentVariable("DATABASE_NAME", "elaview_test");
        Environment.SetEnvironmentVariable("DATABASE_USER", "test");
        Environment.SetEnvironmentVariable("DATABASE_PASSWORD", "test");

        HttpClient = CreateClient();

        _dbConnection = new NpgsqlConnection(_dbContainer.GetConnectionString());
        await _dbConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"]
        });
    }

    public async Task ResetDatabaseAsync() {
        await _respawner.ResetAsync(_dbConnection);
    }

    public new async Task DisposeAsync() {
        await _dbConnection.DisposeAsync();
        await _dbContainer.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder) {
        builder.UseEnvironment("Testing");
    }
}
```

### Collection Definition

```csharp
[CollectionDefinition("Integration")]
public class IntegrationTestCollection : ICollectionFixture<IntegrationTestFixture>;
```

### Test Base Class

```csharp
[Collection("Integration")]
public abstract class IntegrationTestBase : IAsyncLifetime {
    protected readonly IntegrationTestFixture Fixture;
    protected readonly HttpClient Client;

    protected IntegrationTestBase(IntegrationTestFixture fixture) {
        Fixture = fixture;
        Client = fixture.HttpClient;
    }

    public virtual Task InitializeAsync() => Task.CompletedTask;

    public virtual async Task DisposeAsync() {
        await Fixture.ResetDatabaseAsync();
    }
}
```

---

## GraphQL Testing

### GraphQL Test Extensions

```csharp
public static class HttpClientGraphQLExtensions {
    public static async Task<GraphQLResponse<T>> QueryAsync<T>(
        this HttpClient client,
        string query,
        object? variables = null,
        CancellationToken ct = default
    ) {
        var request = new {
            query,
            variables
        };

        var response = await client.PostAsJsonAsync("/api/graphql", request, ct);
        var content = await response.Content.ReadFromJsonAsync<GraphQLResponse<T>>(ct);
        return content!;
    }

    public static async Task<GraphQLResponse<T>> MutateAsync<T>(
        this HttpClient client,
        string mutation,
        object? variables = null,
        CancellationToken ct = default
    ) => await client.QueryAsync<T>(mutation, variables, ct);
}

public record GraphQLResponse<T>(T? Data, List<GraphQLError>? Errors);
public record GraphQLError(string Message, Dictionary<string, object?>? Extensions);
```

### GraphQL Query Tests

```csharp
[Collection("Integration")]
public sealed class UserQueriesTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetCurrentUser_Authenticated_ReturnsUser() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<CurrentUserResponse>("""
            query {
                currentUser {
                    id
                    email
                    name
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data.Should().NotBeNull();
        response.Data!.CurrentUser.Email.Should().Be(user.Email);
    }

    [Fact]
    public async Task GetCurrentUser_Unauthenticated_ReturnsUnauthorized() {
        var response = await Client.QueryAsync<CurrentUserResponse>("""
            query {
                currentUser {
                    id
                }
            }
            """);

        response.Errors.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue.Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task GetUsers_AsAdmin_ReturnsPaginatedUsers() {
        await LoginAsAdminAsync();
        await SeedUsersAsync(25);

        var response = await Client.QueryAsync<UsersResponse>("""
            query {
                users(first: 10) {
                    nodes { id email }
                    pageInfo { hasNextPage hasPreviousPage }
                    totalCount
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.Users.Nodes.Should().HaveCount(10);
        response.Data!.Users.PageInfo.HasNextPage.Should().BeTrue();
        response.Data!.Users.TotalCount.Should().BeGreaterOrEqualTo(25);
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

        response.Errors.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue.Should().Be("AUTH_NOT_AUTHORIZED");
    }
}
```

### GraphQL Mutation Tests

```csharp
[Collection("Integration")]
public sealed class UserMutationsTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task UpdateCurrentUser_ValidInput_UpdatesUser() {
        await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<UpdateUserResponse>("""
            mutation($input: UpdateUserInput!) {
                updateCurrentUser(input: $input) {
                    id
                    name
                    phone
                }
            }
            """,
            new { input = new { name = "Updated Name", phone = "+1234567890" } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdateCurrentUser.Name.Should().Be("Updated Name");
        response.Data!.UpdateCurrentUser.Phone.Should().Be("+1234567890");
    }

    [Fact]
    public async Task SwitchProfileType_ToSpaceOwner_CreatesProfile() {
        await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<SwitchProfileResponse>("""
            mutation {
                switchProfileType(type: SPACE_OWNER) {
                    id
                    activeProfileType
                    spaceOwnerProfile { id }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SwitchProfileType.ActiveProfileType.Should().Be("SPACE_OWNER");
        response.Data!.SwitchProfileType.SpaceOwnerProfile.Should().NotBeNull();
    }
}
```

---

## REST API Testing

### Auth Endpoint Tests

```csharp
[Collection("Integration")]
public sealed class LoginTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithCookie() {
        var user = await SeedUserAsync("test@example.com", "Password123!");

        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email = "test@example.com",
            password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Should().ContainKey("Set-Cookie");
        response.Headers.GetValues("Set-Cookie")
            .Should().Contain(c => c.StartsWith("ElaviewAuth="));

        var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
        body!.User.Email.Should().Be("test@example.com");
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
}
```

### Signup Tests

```csharp
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
        body!.User.Email.Should().Be("newuser@example.com");
        body!.User.Name.Should().Be("New User");
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
}
```

---

## Unit Testing

### Service Layer Tests

```csharp
public sealed class BookingServiceTests {
    private readonly Mock<IBookingRepository> _repositoryMock = new();
    private readonly Mock<IPaymentService> _paymentServiceMock = new();
    private readonly BookingService _sut;

    public BookingServiceTests() {
        _sut = new BookingService(_repositoryMock.Object, _paymentServiceMock.Object);
    }

    [Fact]
    public void CalculateBookingAmount_ValidInput_CalculatesCorrectly() {
        var space = SpaceFactory.Create(s => {
            s.PricePerDay = 100m;
            s.InstallationFee = 25m;
        });
        var startDate = new DateTime(2026, 2, 1);
        var endDate = new DateTime(2026, 2, 8);

        var result = _sut.CalculateBookingAmount(space, startDate, endDate);

        result.TotalDays.Should().Be(7);
        result.SubtotalAmount.Should().Be(700m);
        result.InstallationFee.Should().Be(25m);
        result.PlatformFeeAmount.Should().Be(70m);
        result.TotalAmount.Should().Be(795m);
        result.OwnerPayoutAmount.Should().Be(725m);
    }

    [Theory]
    [InlineData(BookingStatus.PendingApproval, BookingStatus.Approved, true)]
    [InlineData(BookingStatus.PendingApproval, BookingStatus.Rejected, true)]
    [InlineData(BookingStatus.Approved, BookingStatus.Paid, true)]
    [InlineData(BookingStatus.Approved, BookingStatus.Cancelled, true)]
    [InlineData(BookingStatus.Paid, BookingStatus.FileDownloaded, true)]
    [InlineData(BookingStatus.Paid, BookingStatus.Approved, false)]
    [InlineData(BookingStatus.Completed, BookingStatus.Cancelled, false)]
    [InlineData(BookingStatus.Rejected, BookingStatus.Approved, false)]
    public void ValidateStatusTransition_ReturnsExpectedResult(
        BookingStatus from, BookingStatus to, bool expected
    ) {
        var result = _sut.ValidateStatusTransition(from, to);
        result.Should().Be(expected);
    }

    [Fact]
    public void CalculateStage1Payout_ReturnsCorrectAmount() {
        var booking = BookingFactory.Create(b => {
            b.SubtotalAmount = 700m;
            b.InstallationFee = 25m;
        });

        var result = _sut.CalculateStage1Payout(booking);

        result.Should().Be(235m);
    }

    [Fact]
    public void CalculateStage2Payout_ReturnsCorrectAmount() {
        var booking = BookingFactory.Create(b => {
            b.SubtotalAmount = 700m;
            b.InstallationFee = 25m;
        });

        var result = _sut.CalculateStage2Payout(booking);

        result.Should().Be(490m);
    }
}
```

### Repository Tests (Integration)

```csharp
[Collection("Integration")]
public sealed class UserRepositoryTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetByIdAsync_ExistingUser_ReturnsUser() {
        var seededUser = await SeedUserAsync();
        var repository = GetService<IUserRepository>();

        var result = await repository.GetByIdAsync(seededUser.Id, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Email.Should().Be(seededUser.Email);
    }

    [Fact]
    public async Task GetByIdAsync_NonexistentUser_ReturnsNull() {
        var repository = GetService<IUserRepository>();

        var result = await repository.GetByIdAsync(Guid.NewGuid(), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task AddAsync_ValidUser_PersistsUser() {
        var repository = GetService<IUserRepository>();
        var user = UserFactory.Create();

        var result = await repository.AddAsync(user, CancellationToken.None);

        result.Id.Should().NotBeEmpty();
        var fetched = await repository.GetByIdAsync(result.Id, CancellationToken.None);
        fetched.Should().NotBeNull();
        fetched!.Email.Should().Be(user.Email);
    }
}
```

---

## Factories

### Factory Pattern

```csharp
public static class UserFactory {
    private static readonly Faker _faker = new();

    public static User Create(Action<User>? customize = null) {
        var user = new User {
            Id = Guid.NewGuid(),
            Email = _faker.Internet.Email(),
            Password = BCrypt.Net.BCrypt.HashPassword("Test123!"),
            Name = _faker.Name.FullName(),
            Role = UserRole.User,
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(user);
        return user;
    }

    public static User CreateAdmin(Action<User>? customize = null) {
        return Create(u => {
            u.Role = UserRole.Admin;
            u.Email = "admin@test.com";
            customize?.Invoke(u);
        });
    }

    public static List<User> CreateMany(int count, Action<User, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var user = Create();
                customize?.Invoke(user, i);
                return user;
            })
            .ToList();
    }
}

public static class SpaceFactory {
    private static readonly Faker _faker = new();

    public static Space Create(Action<Space>? customize = null) {
        var space = new Space {
            Id = Guid.NewGuid(),
            Title = _faker.Commerce.ProductName(),
            Description = _faker.Lorem.Paragraph(),
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = _faker.Address.StreetAddress(),
            City = _faker.Address.City(),
            State = _faker.Address.StateAbbr(),
            Latitude = _faker.Address.Latitude(),
            Longitude = _faker.Address.Longitude(),
            PricePerDay = _faker.Random.Decimal(10, 100),
            InstallationFee = _faker.Random.Decimal(10, 50),
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(space);
        return space;
    }
}

public static class BookingFactory {
    private static readonly Faker _faker = new();

    public static Booking Create(Action<Booking>? customize = null) {
        var startDate = _faker.Date.Future();
        var endDate = startDate.AddDays(_faker.Random.Int(7, 30));
        var totalDays = (endDate - startDate).Days;
        var pricePerDay = _faker.Random.Decimal(10, 100);
        var subtotal = pricePerDay * totalDays;

        var booking = new Booking {
            Id = Guid.NewGuid(),
            Status = BookingStatus.PendingApproval,
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = pricePerDay,
            SubtotalAmount = subtotal,
            InstallationFee = _faker.Random.Decimal(10, 50),
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = subtotal * 0.10m,
            TotalAmount = subtotal * 1.10m,
            OwnerPayoutAmount = subtotal,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(booking);
        return booking;
    }

    public static Booking CreateWithStatus(BookingStatus status, Action<Booking>? customize = null) {
        return Create(b => {
            b.Status = status;
            customize?.Invoke(b);
        });
    }
}
```

---

## Test Helpers

### Authentication Helpers

```csharp
public abstract class IntegrationTestBase {
    protected async Task<User> CreateAndLoginUserAsync(Action<User>? customize = null) {
        var user = UserFactory.Create(customize);
        await SeedUserAsync(user);
        await LoginAsync(user.Email, "Test123!");
        return user;
    }

    protected async Task LoginAsAdminAsync() {
        var admin = UserFactory.CreateAdmin();
        await SeedUserAsync(admin);
        await LoginAsync(admin.Email, "Test123!");
    }

    protected async Task LoginAsync(string email, string password) {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new {
            email,
            password
        });
        response.EnsureSuccessStatusCode();
    }

    protected async Task<User> SeedUserAsync(User? user = null) {
        user ??= UserFactory.Create();
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    protected async Task<User> SeedUserAsync(string email, string password) {
        var user = UserFactory.Create(u => {
            u.Email = email;
            u.Password = BCrypt.Net.BCrypt.HashPassword(password);
        });
        return await SeedUserAsync(user);
    }

    protected async Task<List<User>> SeedUsersAsync(int count) {
        var users = UserFactory.CreateMany(count);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Users.AddRange(users);
        await context.SaveChangesAsync();
        return users;
    }

    protected T GetService<T>() where T : notnull {
        using var scope = Fixture.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<T>();
    }

    // Additional helpers for edge case testing (added 2026-01-22)
    protected async Task<Booking> SeedBookingWithDatesAsync(
        Guid campaignId, Guid spaceId, DateTime startDate, DateTime endDate,
        BookingStatus status = BookingStatus.PendingApproval);

    protected async Task<Booking> SeedBookingWithPricingAsync(
        Guid campaignId, Guid spaceId, decimal subtotal, decimal installationFee,
        BookingStatus status = BookingStatus.PendingApproval);

    protected async Task<Space> SeedSpaceWithPropertiesAsync(
        Guid spaceOwnerProfileId, string city, decimal pricePerDay,
        int minDuration = 7);

    protected async Task<Space> SeedSpaceWithMinDurationAsync(
        Guid spaceOwnerProfileId, int minDuration);

    protected async Task<Payment> SeedPaymentAsync(
        Guid bookingId, PaymentStatus status = PaymentStatus.Pending);

    protected async Task<Payout> SeedPayoutAsync(
        Guid bookingId, Guid spaceOwnerProfileId, PayoutStage stage,
        PayoutStatus status = PayoutStatus.Pending);
}
```

### Response Models (Duplicated in Test Project)

```csharp
namespace ElaviewBackend.Tests.Shared.Models;

public record CurrentUserResponse(CurrentUserData CurrentUser);
public record CurrentUserData(Guid Id, string Email, string Name);

public record UsersResponse(UsersConnection Users);
public record UsersConnection(List<UserNode> Nodes, PageInfo PageInfo, int TotalCount);
public record UserNode(Guid Id, string Email, string? Name);
public record PageInfo(bool HasNextPage, bool HasPreviousPage);

public record UpdateUserResponse(UpdateUserData UpdateCurrentUser);
public record UpdateUserData(Guid Id, string? Name, string? Phone);

public record SwitchProfileResponse(SwitchProfileData SwitchProfileType);
public record SwitchProfileData(Guid Id, string ActiveProfileType, ProfileData? SpaceOwnerProfile);
public record ProfileData(Guid Id);

public record LoginResponse(UserData User);
public record SignupResponse(UserData User);
public record UserData(Guid Id, string Email, string Name);
```

---

## Test Organization

### Naming Convention

| Pattern                          | Example                                              |
|----------------------------------|------------------------------------------------------|
| `{Method}_{Scenario}_{Expected}` | `Login_ValidCredentials_ReturnsOkWithCookie`         |
| `{Method}_{Scenario}_{Expected}` | `GetCurrentUser_Unauthenticated_ReturnsUnauthorized` |

### Test Categories by Feature

| Feature       | Unit Tests                       | Integration Tests              |
|---------------|----------------------------------|--------------------------------|
| Users         | Service calculations             | Queries, Mutations, Auth flows |
| Spaces        | Availability calculations        | CRUD operations, filtering     |
| Bookings      | Amount calculations, transitions | Full lifecycle, status changes |
| Payments      | Fee calculations, payout stages  | Stripe integration (mocked)    |
| Notifications | Trigger logic                    | Delivery, preferences          |

### What to Test

**Always Test**:

- All HTTP status codes returned by endpoint
- All GraphQL error codes
- All booking status transitions (valid and invalid)
- All payment calculations
- Authorization rules (owner-only, admin-only)
- Pagination boundaries
- Input validation failures

**Never Test**:

- Framework behavior (EF Core, HotChocolate)
- Third-party library internals
- Private methods directly

---

## Best Practices

### Response Model Duplication

Duplicate API response models in the test project instead of referencing production code. This catches breaking changes:

```csharp
namespace ElaviewBackend.Tests.Shared.Models;

public record CurrentUserResponse(CurrentUserData CurrentUser);
```

If the API changes `currentUser` to `me`, the test model mismatch fails the test.

### Test All Status Codes

For each endpoint, test every documented response:

| Endpoint         | Status Codes to Test                                 |
|------------------|------------------------------------------------------|
| POST /login      | 200 OK, 400 Bad Request, 401 Unauthorized            |
| POST /signup     | 200 OK, 400 Bad Request, 409 Conflict                |
| GraphQL Query    | Success, AUTH_NOT_AUTHENTICATED, AUTH_NOT_AUTHORIZED |
| GraphQL Mutation | Success, NOT_FOUND, VALIDATION_FAILED, FORBIDDEN     |

### Database Reset Strategy

```csharp
public async Task DisposeAsync() {
    await Fixture.ResetDatabaseAsync();
}
```

Call `ResetDatabaseAsync()` in `DisposeAsync()` to ensure each test starts with clean state.

### Avoid Test Interdependence

Tests must not depend on execution order or shared state:

```csharp
[Fact]
public async Task Test1_CreatesUser() {
    await SeedUserAsync("user@test.com", "Pass123!");
}

[Fact]
public async Task Test2_AssumesUserExists() {
    await SeedUserAsync("user@test.com", "Pass123!");
}
```

### Use Theory for Parameterized Tests

```csharp
[Theory]
[InlineData("", "Password123!", HttpStatusCode.BadRequest)]
[InlineData("invalid-email", "Password123!", HttpStatusCode.BadRequest)]
[InlineData("valid@email.com", "", HttpStatusCode.BadRequest)]
[InlineData("valid@email.com", "weak", HttpStatusCode.BadRequest)]
public async Task Login_InvalidInput_ReturnsBadRequest(
    string email, string password, HttpStatusCode expected
) {
    var response = await Client.PostAsJsonAsync("/api/auth/login", new { email, password });
    response.StatusCode.Should().Be(expected);
}
```

---

## Implemented Edge Case Tests

Tests implemented in `Tests/Integration/Marketplace/` and `Tests/Integration/Payments/`.

### Booking Authorization (`BookingAuthorizationTests.cs`)

| Test Case | Status |
|-----------|--------|
| `ApproveBooking_AsAdvertiser_ReturnsForbidden` | ✅ Implemented |
| `RejectBooking_AsAdvertiser_ReturnsForbidden` | ✅ Implemented |
| `MarkFileDownloaded_AsAdvertiser_ReturnsForbidden` | ✅ Implemented |
| `MarkInstalled_AsAdvertiser_ReturnsForbidden` | ✅ Implemented |
| `CancelBooking_AsUnrelatedUser_ReturnsForbidden` | ✅ Implemented |

### Booking Validation (`BookingValidationTests.cs`)

| Test Case | Status |
|-----------|--------|
| `CreateBooking_StartDateInPast_ReturnsValidationError` | ✅ Implemented |
| `CreateBooking_EndBeforeStart_ReturnsValidationError` | ✅ Implemented |
| `CreateBooking_ZeroDuration_ReturnsValidationError` | ✅ Implemented |
| `CreateBooking_BelowMinDuration_ReturnsValidationError` | ✅ Implemented |
| `CreateBooking_NonexistentCampaign_ReturnsNotFound` | ✅ Implemented |
| `CreateBooking_NonexistentSpace_ReturnsNotFound` | ✅ Implemented |

### Booking Status Transitions (`BookingStatusTransitionTests.cs`)

| Test Case | Status |
|-----------|--------|
| `ApproveBooking_NotPendingApproval_ReturnsInvalidStatusTransition` | ✅ Implemented (Theory, 7 statuses) |
| `RejectBooking_NotPendingApproval_ReturnsInvalidStatusTransition` | ✅ Implemented (Theory, 7 statuses) |
| `MarkFileDownloaded_NotPaid_ReturnsInvalidStatusTransition` | ✅ Implemented (Theory, 6 statuses) |
| `MarkInstalled_NotFileDownloaded_ReturnsInvalidStatusTransition` | ✅ Implemented (Theory, 6 statuses) |
| `CancelBooking_NotCancellable_ReturnsInvalidStatusTransition` | ✅ Implemented (Theory, 5 statuses) |

### Space Authorization (`SpaceAuthorizationTests.cs`)

| Test Case | Status |
|-----------|--------|
| `UpdateSpace_AsNonOwner_ReturnsForbidden` | ✅ Implemented |
| `DeleteSpace_AsNonOwner_ReturnsForbidden` | ✅ Implemented |
| `DeactivateSpace_AsNonOwner_ReturnsForbidden` | ✅ Implemented |

### Space Validation (`SpaceValidationTests.cs`)

| Test Case | Status |
|-----------|--------|
| `DeactivateSpace_WithActiveBooking_ReturnsConflict` | ✅ Implemented |
| `DeleteSpace_WithActiveBooking_ReturnsConflict` | ✅ Implemented |
| `CreateBooking_OnInactiveSpace_ReturnsForbidden` | ✅ Implemented |
| `CreateBooking_OverlappingDates_ReturnsConflict` | ✅ Implemented |
| `CreateSpace_NegativePrice_ReturnsValidationError` | ✅ Implemented |
| `UpdateSpace_NegativePrice_ReturnsValidationError` | ✅ Implemented |

### Payment Edge Cases (`PaymentEdgeCaseTests.cs`)

| Test Case | Status |
|-----------|--------|
| `CreatePaymentIntent_NotApproved_ReturnsInvalidStatusTransition` | ✅ Implemented |
| `CreatePaymentIntent_AlreadyPaid_ReturnsConflict` | ✅ Implemented |
| `CreatePaymentIntent_AsNonAdvertiser_ReturnsForbidden` | ✅ Implemented |
| `CreatePaymentIntent_NonexistentBooking_ReturnsNotFound` | ✅ Implemented |
| `RequestRefund_NoPayment_ReturnsNotFound` | ✅ Implemented |

### Pagination Edge Cases (`PaginationEdgeCaseTests.cs`)

| Test Case | Status |
|-----------|--------|
| `GetSpaces_NoMatches_ReturnsEmptyConnection` | ✅ Implemented |
| `GetSpaces_FilterAndSort_CombinesCorrectly` | ✅ Implemented |
| `GetBookings_AsAdvertiser_ReturnsOnlyOwn` | ✅ Implemented |
| `GetBookings_AsOwner_ReturnsOnlyOwn` | ✅ Implemented |
| `GetSpaces_WithPagination_ReturnsCorrectPage` | ✅ Implemented |

---

## Remaining Edge Cases (Not Yet Implemented)

### Booking Lifecycle

| Test Case | Priority | Description |
|-----------|----------|-------------|
| `Booking_AutoApprovalAfter48Hours_CompletesAutomatically` | High | System auto-approves verification after timeout |
| `CancelBooking_AtEachStatus_ReturnsCorrectRefund` | High | Cancellation refund varies by status |
| `DisputeBooking_ValidReason_TransitionsToDisputed` | Medium | Advertiser disputes after installation |
| `ResolveDispute_InFavorOfOwner_ReleasesRemainingPayout` | Medium | Dispute resolution payout logic |
| `ResolveDispute_InFavorOfAdvertiser_RefundsPartial` | Medium | Dispute resolution refund logic |

### Payment Flow

| Test Case | Priority | Description |
|-----------|----------|-------------|
| `ProcessPayment_StripeDeclined_ReturnsPaymentError` | High | Card declined handling |
| `ProcessPayment_DoubleSubmission_ReturnsIdempotent` | High | Prevent duplicate charges |
| `Stage1Payout_OnFileDownload_TriggersCorrectAmount` | High | Print+install fee payout |
| `Stage2Payout_OnVerificationApproved_TriggersRemainder` | High | Final payout after approval |
| `Payout_InvalidStripeAccount_ReturnsPaymentError` | Medium | Owner's Stripe Connect invalid |
| `Webhook_InvalidSignature_ReturnsUnauthorized` | Medium | Stripe webhook security |
| `Webhook_DuplicateEvent_IsIdempotent` | Medium | Handle webhook retries |
| `Refund_PartialAmount_CalculatesCorrectly` | Medium | Partial refund scenarios |

```csharp
[Fact]
public async Task ProcessPayment_DoubleSubmission_ChargesOnlyOnce() {
    var booking = await SeedApprovedBookingAsync();
    await LoginAsAdvertiserAsync(booking.AdvertiserId);

    var tasks = Enumerable.Range(0, 3).Select(_ =>
        Client.MutateAsync<PayBookingResponse>("""
            mutation($id: ID!) {
                payBooking(id: $id) {
                    booking { status }
                    errors { __typename }
                }
            }
            """, new { id = booking.Id })
    );

    var responses = await Task.WhenAll(tasks);

    responses.Count(r => r.Data?.PayBooking.Booking?.Status == "PAID")
        .Should().Be(1);
    responses.Count(r => r.Data?.PayBooking.Errors?.Any() == true)
        .Should().Be(2);
}

[Fact]
public async Task Stage1Payout_OnFileDownload_TriggersCorrectAmount() {
    var booking = await SeedPaidBookingAsync(b => {
        b.InstallationFee = 25m;
        b.SubtotalAmount = 700m;
    });
    await LoginAsOwnerAsync(booking.Space.SpaceOwnerProfile.UserId);

    await Client.MutateAsync<DownloadFileResponse>("""
        mutation($id: ID!) {
            markFileDownloaded(bookingId: $id) {
                booking { status }
            }
        }
        """, new { id = booking.Id });

    var payout = await GetLatestPayoutAsync(booking.Id);
    payout.Amount.Should().Be(235m);
    payout.Stage.Should().Be(PayoutStage.Stage1);
}
```

### Space Management

| Test Case | Priority | Description |
|-----------|----------|-------------|
| `UpdateSpace_WhileActiveBooking_AllowsNonCriticalFields` | Medium | Can update description, not price |
| `CreateSpace_InvalidCoordinates_ReturnsValidationError` | Low | Lat/long bounds check |
| `GetSpaces_FilterByAvailability_ExcludesBooked` | Medium | Availability filter accuracy |

### File & Verification Flow

| Test Case | Priority | Description |
|-----------|----------|-------------|
| `DownloadFile_AlreadyDownloaded_ReturnsIdempotent` | Medium | Track but don't error |
| `UploadVerification_BeforeDownload_ReturnsForbidden` | High | Enforce flow order |
| `UploadVerification_ExpiredWindow_ReturnsForbidden` | Medium | Time limit enforcement |
| `ApproveVerification_WithoutPhotos_ReturnsValidationError` | Medium | Require evidence |

### Authorization

| Test Case | Priority | Description |
|-----------|----------|-------------|
| `CreateCampaign_AsSpaceOwner_ReturnsForbidden` | Medium | Profile type enforcement |
| `SwitchProfile_DuringActiveBooking_Allowed` | Low | Profile switch doesn't break bookings |

---

## Running Tests

### Commands

```bash
dotnet test

dotnet test --filter Category=Unit

dotnet test --filter Category=Integration

dotnet test --filter FullyQualifiedName~UserQueriesTests

dotnet test --logger "console;verbosity=detailed"

dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov
```

### CI Configuration

```yaml
test:
  runs-on: ubuntu-latest
  services:
    docker:
      image: docker:dind
  steps:
    - uses: actions/checkout@v4
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '10.x'
    - name: Run Tests
      run: dotnet test --configuration Release --logger trx --results-directory TestResults
    - name: Upload Results
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: TestResults
```

---

**Last Updated**: 2026-01-22 (Edge case tests implemented)
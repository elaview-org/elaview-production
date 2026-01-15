# Error Handling Specification

Complete specification for Elaview backend error handling using HotChocolate v15 mutation conventions and domain
exceptions.

---

## Architecture Overview

### Error Handling Philosophy

**Domain Exceptions for Business Errors**: Services throw typed exceptions for business rule violations. HotChocolate
middleware catches and transforms them into structured GraphQL errors.

**Schema-Exposed Errors**: Mutation errors are part of the GraphQL schema via union types. Clients can pattern-match on
specific error types.

**Clean Resolvers**: No try/catch in resolvers. Exception-based flow keeps resolver code focused on delegation.

### Error Categories

| Category          | Handling                      | Schema Exposure      | Examples                               |
|-------------------|-------------------------------|----------------------|----------------------------------------|
| Domain Errors     | Typed exceptions + `[Error]`  | Yes (union type)     | NotFound, InvalidTransition, Forbidden |
| Validation Errors | HotChocolate input validation | Yes (errors field)   | Missing required fields, format errors |
| Auth Errors       | `[Authorize]` middleware      | Yes (extensions)     | Unauthenticated, unauthorized          |
| System Errors     | Error filter                  | No (generic message) | Database failures, external API errors |

### Directory Structure

```
Data/
├── Exceptions/
│   ├── DomainException.cs        # Base class
│   ├── NotFoundException.cs
│   ├── ForbiddenException.cs
│   ├── InvalidStatusTransitionException.cs
│   ├── ValidationException.cs
│   ├── ConflictException.cs
│   └── PaymentException.cs
└── Errors/
    ├── ErrorFilter.cs            # IErrorFilter implementation
    └── ErrorCodes.cs             # Constants
```

---

## Domain Exceptions

### Base Exception Class

```csharp
public abstract class DomainException : Exception {
    public string Code { get; }

    protected DomainException(string code, string message) : base(message) {
        Code = code;
    }
}
```

### Exception Inventory

| Exception                        | Code                      | HTTP Equivalent | Usage                                 |
|----------------------------------|---------------------------|-----------------|---------------------------------------|
| NotFoundException                | NOT_FOUND                 | 404             | Entity does not exist                 |
| ForbiddenException               | FORBIDDEN                 | 403             | User lacks permission                 |
| InvalidStatusTransitionException | INVALID_STATUS_TRANSITION | 400             | Booking status rules violated         |
| ValidationException              | VALIDATION_FAILED         | 400             | Business validation failed            |
| ConflictException                | CONFLICT                  | 409             | Duplicate resource, concurrent update |
| PaymentException                 | PAYMENT_FAILED            | 400             | Stripe operation failed               |
| PayoutException                  | PAYOUT_FAILED             | 400             | Stripe transfer failed                |

### Exception Definitions

```csharp
public sealed class NotFoundException : DomainException {
    public string EntityType { get; }
    public Guid EntityId { get; }

    public NotFoundException(string entityType, Guid entityId)
        : base("NOT_FOUND", $"{entityType} with ID {entityId} not found") {
        EntityType = entityType;
        EntityId = entityId;
    }
}

public sealed class ForbiddenException : DomainException {
    public string Action { get; }

    public ForbiddenException(string action)
        : base("FORBIDDEN", $"Not authorized to {action}") {
        Action = action;
    }
}

public sealed class InvalidStatusTransitionException : DomainException {
    public string FromStatus { get; }
    public string ToStatus { get; }

    public InvalidStatusTransitionException(BookingStatus from, BookingStatus to)
        : base("INVALID_STATUS_TRANSITION", $"Cannot transition from {from} to {to}") {
        FromStatus = from.ToString();
        ToStatus = to.ToString();
    }
}

public sealed class ValidationException : DomainException {
    public string Field { get; }

    public ValidationException(string field, string message)
        : base("VALIDATION_FAILED", message) {
        Field = field;
    }
}

public sealed class ConflictException : DomainException {
    public string Resource { get; }

    public ConflictException(string resource, string message)
        : base("CONFLICT", message) {
        Resource = resource;
    }
}

public sealed class PaymentException : DomainException {
    public string? StripeErrorCode { get; }

    public PaymentException(string message, string? stripeErrorCode = null)
        : base("PAYMENT_FAILED", message) {
        StripeErrorCode = stripeErrorCode;
    }
}
```

---

## Mutation Conventions

### Configuration

```csharp
builder
    .AddGraphQL()
    .AddMutationConventions(new MutationConventionOptions {
        InputArgumentName = "input",
        InputTypeNamePattern = "{MutationName}Input",
        PayloadTypeNamePattern = "{MutationName}Payload",
        PayloadErrorTypeNamePattern = "{MutationName}Error",
        PayloadErrorsFieldName = "errors",
        ApplyToAllMutations = true
    });
```

### Mutation Pattern with [Error]

```csharp
[MutationType]
public static partial class BookingMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<Booking> ApproveBooking(
        [ID] Guid id,
        string? ownerNotes,
        IBookingService bookingService,
        CancellationToken ct
    ) => await bookingService.ApproveAsync(id, ownerNotes, ct);
}
```

### Generated Schema

```graphql
type Mutation {
    approveBooking(input: ApproveBookingInput!): ApproveBookingPayload!
}

input ApproveBookingInput {
    id: ID!
    ownerNotes: String
}

type ApproveBookingPayload {
    booking: Booking
    errors: [ApproveBookingError!]
}

union ApproveBookingError =
    | NotFoundError
    | ForbiddenError
    | InvalidStatusTransitionError
```

### Error Type Mapping

Exceptions map to error types automatically. "Exception" suffix replaced with "Error":

| Exception Class                  | GraphQL Error Type           |
|----------------------------------|------------------------------|
| NotFoundException                | NotFoundError                |
| ForbiddenException               | ForbiddenError               |
| InvalidStatusTransitionException | InvalidStatusTransitionError |
| ValidationException              | ValidationFailedError        |
| ConflictException                | ConflictError                |
| PaymentException                 | PaymentFailedError           |

---

## Service Layer Errors

### Throwing Domain Exceptions

```csharp
public sealed class BookingService(
    IBookingRepository repository,
    ISpaceService spaceService,
    IHttpContextAccessor httpContextAccessor
) : IBookingService {

    public async Task<Booking> ApproveAsync(Guid id, string? ownerNotes, CancellationToken ct) {
        var booking = await repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        var currentUserId = GetCurrentUserId();
        if (booking.Space.SpaceOwnerProfile.UserId != currentUserId)
            throw new ForbiddenException("approve this booking");

        if (booking.Status != BookingStatus.PendingApproval)
            throw new InvalidStatusTransitionException(booking.Status, BookingStatus.Approved);

        booking.Status = BookingStatus.Approved;
        booking.OwnerNotes = ownerNotes;
        booking.UpdatedAt = DateTime.UtcNow;

        await repository.SaveChangesAsync(ct);
        return booking;
    }

    private Guid GetCurrentUserId() {
        var claim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        return claim is not null ? Guid.Parse(claim.Value) : throw new ForbiddenException("access this resource");
    }
}
```

### Error Scenarios by Feature

| Feature       | Operation           | Possible Errors                                                                              |
|---------------|---------------------|----------------------------------------------------------------------------------------------|
| **Users**     | updateCurrentUser   | ValidationException                                                                          |
|               | switchProfileType   | ValidationException                                                                          |
| **Spaces**    | createSpace         | ValidationException                                                                          |
|               | updateSpace         | NotFoundException, ForbiddenException                                                        |
|               | deleteSpace         | NotFoundException, ForbiddenException, ConflictException                                     |
| **Campaigns** | createCampaign      | ValidationException                                                                          |
|               | updateCampaign      | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
|               | deleteCampaign      | NotFoundException, ForbiddenException, ConflictException                                     |
| **Bookings**  | createBooking       | NotFoundException, ValidationException, ConflictException                                    |
|               | approveBooking      | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
|               | rejectBooking       | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
|               | cancelBooking       | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
|               | submitProof         | NotFoundException, ForbiddenException, InvalidStatusTransitionException, ValidationException |
|               | approveProof        | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
|               | disputeProof        | NotFoundException, ForbiddenException, InvalidStatusTransitionException                      |
| **Payments**  | createPaymentIntent | NotFoundException, ForbiddenException, PaymentException                                      |
|               | confirmPayment      | PaymentException                                                                             |
|               | requestRefund       | NotFoundException, PaymentException                                                          |
| **Reviews**   | createReview        | NotFoundException, ForbiddenException, ConflictException, InvalidStatusTransitionException   |

---

## Query Error Handling

### Authorization Errors

Queries use `[Authorize]` middleware. Unauthenticated/unauthorized requests return errors in extensions:

```csharp
[QueryType]
public static partial class UserQueries {
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> GetCurrentUser(IUserService userService)
        => userService.GetCurrentUserQuery();

    [Authorize(Roles = ["Admin"])]
    [UsePaging][UseProjection][UseFiltering][UseSorting]
    public static IQueryable<User> GetUsers(IUserService userService)
        => userService.GetUsersQuery();
}
```

### Auth Error Response

```json
{
    "errors": [{
        "message": "The current user is not authorized to access this resource.",
        "extensions": {
            "code": "AUTH_NOT_AUTHORIZED"
        }
    }],
    "data": { "users": null }
}
```

### Query Error Codes

| Code                   | Scenario                 |
|------------------------|--------------------------|
| AUTH_NOT_AUTHENTICATED | No valid session/token   |
| AUTH_NOT_AUTHORIZED    | User lacks required role |

---

## Subscription Error Handling

### Authorization

```csharp
[SubscriptionType]
public static partial class NotificationSubscriptions {
    [Authorize]
    [Subscribe]
    [Topic("{userId}:notifications")]
    public static Notification OnNotification(
        Guid userId,
        [EventMessage] Notification notification
    ) => notification;
}
```

### Connection Errors

WebSocket subscriptions handle errors at connection level. Unauthorized connections are rejected before establishing the
stream.

---

## Error Filter

### System Error Transformation

```csharp
public sealed class ErrorFilter : IErrorFilter {
    private readonly IWebHostEnvironment _env;

    public ErrorFilter(IWebHostEnvironment env) {
        _env = env;
    }

    public IError OnError(IError error) {
        if (error.Exception is DomainException domain) {
            return ErrorBuilder.FromError(error)
                .SetMessage(domain.Message)
                .SetCode(domain.Code)
                .RemoveException()
                .Build();
        }

        if (_env.IsDevelopment())
            return error;

        return ErrorBuilder.FromError(error)
            .SetMessage("An unexpected error occurred.")
            .SetCode("INTERNAL_ERROR")
            .RemoveException()
            .Build();
    }
}
```

### Registration

```csharp
builder.Services.AddErrorFilter<ErrorFilter>();

builder
    .AddGraphQL()
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = builder.Environment.IsDevelopment());
```

---

## REST API Errors (Auth Endpoints)

### Error Response Format

```csharp
public sealed record ErrorResponse(string Code, string Message, object? Details = null);
```

### Auth Controller Pattern

```csharp
[ApiController]
[Route("api/auth")]
public sealed class AuthController(AuthService authService) : ControllerBase {

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct) {
        try {
            var user = await authService.LoginAsync(request.Email, request.Password, ct);
            return Ok(new { user });
        }
        catch (NotFoundException) {
            return Unauthorized(new ErrorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
        }
        catch (ValidationException ex) {
            return BadRequest(new ErrorResponse("VALIDATION_FAILED", ex.Message));
        }
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request, CancellationToken ct) {
        try {
            var user = await authService.SignupAsync(request, ct);
            return Ok(new { user });
        }
        catch (ConflictException) {
            return Conflict(new ErrorResponse("EMAIL_TAKEN", "Email already registered"));
        }
        catch (ValidationException ex) {
            return BadRequest(new ErrorResponse("VALIDATION_FAILED", ex.Message));
        }
    }
}
```

### REST Error Codes

| Endpoint     | Status | Code                | Scenario                     |
|--------------|--------|---------------------|------------------------------|
| POST /login  | 401    | INVALID_CREDENTIALS | Wrong email/password         |
| POST /login  | 400    | VALIDATION_FAILED   | Missing fields               |
| POST /signup | 409    | EMAIL_TAKEN         | Duplicate email              |
| POST /signup | 400    | VALIDATION_FAILED   | Weak password, invalid email |
| POST /logout | 401    | NOT_AUTHENTICATED   | No active session            |
| GET /me      | 401    | NOT_AUTHENTICATED   | No active session            |

---

## Testing Errors

### GraphQL Error Assertions

```csharp
[Fact]
public async Task ApproveBooking_NotFound_ReturnsNotFoundError() {
    await CreateAndLoginAsSpaceOwnerAsync();

    var response = await Client.MutateAsync<ApproveBookingResponse>("""
        mutation($input: ApproveBookingInput!) {
            approveBooking(input: $input) {
                booking { id }
                errors {
                    ... on NotFoundError {
                        __typename
                        message
                        entityType
                        entityId
                    }
                }
            }
        }
        """,
        new { input = new { id = Guid.NewGuid() } });

    response.Data!.ApproveBooking.Booking.Should().BeNull();
    response.Data!.ApproveBooking.Errors.Should().ContainSingle()
        .Which.Should().BeOfType<NotFoundError>()
        .Which.EntityType.Should().Be("Booking");
}

[Fact]
public async Task ApproveBooking_WrongOwner_ReturnsForbiddenError() {
    var booking = await SeedBookingAsync(status: BookingStatus.PendingApproval);
    await CreateAndLoginAsOtherSpaceOwnerAsync();

    var response = await Client.MutateAsync<ApproveBookingResponse>("""
        mutation($input: ApproveBookingInput!) {
            approveBooking(input: $input) {
                booking { id }
                errors {
                    ... on ForbiddenError {
                        __typename
                        message
                        action
                    }
                }
            }
        }
        """,
        new { input = new { id = booking.Id } });

    response.Data!.ApproveBooking.Errors.Should().ContainSingle()
        .Which.Should().BeOfType<ForbiddenError>();
}

[Fact]
public async Task ApproveBooking_InvalidTransition_ReturnsInvalidStatusTransitionError() {
    var booking = await SeedBookingAsync(status: BookingStatus.Paid);
    await LoginAsBookingOwnerAsync(booking);

    var response = await Client.MutateAsync<ApproveBookingResponse>("""
        mutation($input: ApproveBookingInput!) {
            approveBooking(input: $input) {
                booking { id }
                errors {
                    ... on InvalidStatusTransitionError {
                        __typename
                        message
                        fromStatus
                        toStatus
                    }
                }
            }
        }
        """,
        new { input = new { id = booking.Id } });

    response.Data!.ApproveBooking.Errors.Should().ContainSingle()
        .Which.Should().BeOfType<InvalidStatusTransitionError>()
        .Which.FromStatus.Should().Be("PAID");
}
```

### Response Models (Test Project)

```csharp
namespace ElaviewBackend.Tests.Shared.Models;

public record ApproveBookingResponse(ApproveBookingPayload ApproveBooking);
public record ApproveBookingPayload(BookingData? Booking, List<IApproveBookingError>? Errors);

public interface IApproveBookingError {
    string Message { get; }
}

public record NotFoundError(string Message, string EntityType, Guid EntityId) : IApproveBookingError;
public record ForbiddenError(string Message, string Action) : IApproveBookingError;
public record InvalidStatusTransitionError(string Message, string FromStatus, string ToStatus) : IApproveBookingError;
```

### Error Test Coverage Matrix

| Mutation            | NotFound | Forbidden | InvalidTransition | Validation | Conflict | Payment |
|---------------------|----------|-----------|-------------------|------------|----------|---------|
| approveBooking      | ✓        | ✓         | ✓                 |            |          |         |
| rejectBooking       | ✓        | ✓         | ✓                 |            |          |         |
| cancelBooking       | ✓        | ✓         | ✓                 |            |          |         |
| createBooking       | ✓        |           |                   | ✓          | ✓        |         |
| submitProof         | ✓        | ✓         | ✓                 | ✓          |          |         |
| createPaymentIntent | ✓        | ✓         |                   |            |          | ✓       |
| createReview        | ✓        | ✓         | ✓                 |            | ✓        |         |
| updateSpace         | ✓        | ✓         |                   | ✓          |          |         |
| deleteSpace         | ✓        | ✓         |                   |            | ✓        |         |

---

## Client-Side Handling

### TypeScript Error Types (Codegen)

```typescript
type ApproveBookingError =
    | NotFoundError
    | ForbiddenError
    | InvalidStatusTransitionError;

interface NotFoundError {
    __typename: 'NotFoundError';
    message: string;
    entityType: string;
    entityId: string;
}

interface ForbiddenError {
    __typename: 'ForbiddenError';
    message: string;
    action: string;
}
```

### React Query Pattern

```typescript
const { mutate } = useMutation({
    mutationFn: approveBooking,
    onSuccess: (data) => {
        if (data.approveBooking.errors?.length) {
            const error = data.approveBooking.errors[0];
            switch (error.__typename) {
                case 'NotFoundError':
                    showToast('Booking not found');
                    break;
                case 'ForbiddenError':
                    showToast('You do not have permission');
                    break;
                case 'InvalidStatusTransitionError':
                    showToast(`Cannot approve: ${error.message}`);
                    break;
            }
            return;
        }
        showToast('Booking approved');
    }
});
```

---

## Best Practices

| Practice                           | Rationale                                       |
|------------------------------------|-------------------------------------------------|
| Throw from services, not resolvers | Keeps resolvers thin, logic testable            |
| Use typed exceptions               | Enables schema generation, client type safety   |
| Include context in exceptions      | entityType, entityId, fromStatus help debugging |
| Test all error paths               | Each `[Error<T>]` annotation needs a test       |
| Hide system errors in production   | Security: don't leak implementation details     |
| Use error codes consistently       | Clients can switch on codes for i18n            |

---

## Migration from Legacy Pattern

### Before (graphql.md style)

```csharp
public static GraphQLException NotFound(string entity, Guid id) =>
    new($"{entity} with ID {id} not found",
        new Dictionary<string, object?> {
            ["code"] = "NOT_FOUND",
            ["entity"] = entity,
            ["id"] = id
        });
```

### After (HotChocolate v15 conventions)

```csharp
throw new NotFoundException("Booking", id);
```

The mutation convention middleware transforms NotFoundException into a union error type automatically. No manual
exception creation or dictionary building required.

---

**Last Updated**: 2026-01-14

Sources:

- [HotChocolate v15 Mutations](https://chillicream.com/docs/hotchocolate/v15/defining-a-schema/mutations/)
- [HotChocolate v15 Errors API](https://chillicream.com/docs/hotchocolate/v15/api-reference/errors/)
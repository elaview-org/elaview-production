namespace ElaviewBackend.Tests.Shared.Models;

public record MeResponse(MeData? Me);

public record MeData(
    Guid Id,
    string Email,
    string Name,
    string? Phone,
    string Role,
    string Status,
    string ActiveProfileType
);

public record CurrentUserResponse(CurrentUserData? CurrentUser);

public record CurrentUserData(
    Guid Id,
    string Email,
    string Name,
    string? Phone,
    string Role,
    string Status,
    string ActiveProfileType
);

public record UsersResponse(UsersConnection Users);

public record UsersConnection(
    List<UserNode> Nodes,
    PageInfo PageInfo,
    int? TotalCount = null);

public record UserNode(
    Guid Id,
    string Email,
    string? Name,
    string Role,
    string Status);

public record PageInfo(
    bool HasNextPage,
    bool HasPreviousPage,
    string? StartCursor,
    string? EndCursor);

public record UserByIdResponse(UserNode? UserById);

public record UpdateCurrentUserResponse(
    UpdateCurrentUserPayload UpdateCurrentUser);

public record UpdateCurrentUserPayload(UpdatedUserData User);

public record UpdatedUserData(Guid Id, string? Name, string? Phone);

public record SwitchProfileTypeResponse(
    SwitchProfileTypePayload SwitchProfileType);

public record SwitchProfileTypePayload(SwitchProfileData User);

public record SwitchProfileData(Guid Id, string ActiveProfileType);

public record DeleteUserPayloadResponse(DeleteUserPayload DeleteUser);

public record DeleteUserPayload(bool Success);
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Careers;

public record CreateCareerInput(
    string Title,
    CareerDepartment Department,
    CareerType Type,
    string Location,
    string Description,
    string Requirements,
    bool IsActive,
    DateTime? ExpiresAt
);

public record UpdateCareerInput(
    string? Title,
    CareerDepartment? Department,
    CareerType? Type,
    string? Location,
    string? Description,
    string? Requirements,
    bool? IsActive,
    DateTime? ExpiresAt
);

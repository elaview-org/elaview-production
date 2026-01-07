using ElaviewBackend.Shared.Entities;

namespace ElaviewBackend.Features.Spaces;

public record CreateSpaceInput(
    string Title,
    string? Description,
    SpaceType Type,
    string Address,
    string City,
    string State,
    string? ZipCode,
    double Latitude,
    double Longitude,
    double? Width,
    double? Height,
    string? Dimensions,
    decimal PricePerDay,
    decimal? InstallationFee,
    int MinDuration,
    int? MaxDuration,
    List<string>? Images,
    DateTime? AvailableFrom,
    DateTime? AvailableTo,
    string? DimensionsText,
    string? Traffic
);
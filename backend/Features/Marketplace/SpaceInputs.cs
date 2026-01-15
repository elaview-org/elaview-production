using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

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

public record UpdateSpaceInput(
    string? Title,
    string? Description,
    decimal? PricePerDay,
    decimal? InstallationFee,
    int? MinDuration,
    int? MaxDuration,
    List<string>? Images,
    DateTime? AvailableFrom,
    DateTime? AvailableTo,
    string? Traffic
);
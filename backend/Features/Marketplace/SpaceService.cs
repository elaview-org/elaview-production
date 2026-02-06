using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface ISpaceService {
    IQueryable<Space> GetAll();
    IQueryable<Space> GetAllExcludingUser(Guid? userId);
    IQueryable<Space> GetById(Guid id);
    IQueryable<Space> GetByUserId(Guid userId);
    IQueryable<Space> GetByOwnerId(Guid ownerProfileId);
    IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId);
    IQueryable<Review> GetReviewsBySpaceId(Guid spaceId);
    Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct);
    Task<Space> CreateAsync(Guid userId, CreateSpaceInput input, CancellationToken ct);
    Task<Space> UpdateAsync(Guid userId, Guid id, UpdateSpaceInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Space> DeactivateAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Space> ReactivateAsync(Guid userId, Guid id, CancellationToken ct);
}

public sealed class SpaceService(ISpaceRepository repository, IGeocodingService geocodingService) : ISpaceService {
    public IQueryable<Space> GetAll()
        => repository.Query();

    public IQueryable<Space> GetAllExcludingUser(Guid? userId)
        => repository.GetExcludingUserId(userId);

    public IQueryable<Space> GetById(Guid id)
        => repository.Query().Where(s => s.Id == id);

    public IQueryable<Space> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public IQueryable<Space> GetByOwnerId(Guid ownerProfileId)
        => repository.GetByOwnerId(ownerProfileId);

    public IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId)
        => repository.GetBookingsBySpaceId(spaceId);

    public IQueryable<Review> GetReviewsBySpaceId(Guid spaceId)
        => repository.GetReviewsBySpaceId(spaceId);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct)
        => await repository.GetSpaceOwnerBySpaceIdAsync(spaceId, ct);

    public async Task<Space> CreateAsync(Guid userId, CreateSpaceInput input, CancellationToken ct) {
        if (input.PricePerDay < 0)
            throw new ValidationException("PricePerDay", "Price cannot be negative");

        var profile = await repository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);

        var (latitude, longitude) = await ResolveCoordinatesAsync(
            input.Latitude, input.Longitude, input.Address, input.City, input.State, input.ZipCode, ct);

        var space = new Space {
            SpaceOwnerProfileId = profile.Id,
            Title = input.Title,
            Description = input.Description,
            Type = input.Type,
            Status = SpaceStatus.Active,
            Address = input.Address,
            City = input.City,
            State = input.State,
            ZipCode = input.ZipCode,
            Latitude = latitude,
            Longitude = longitude,
            Width = input.Width,
            Height = input.Height,
            Dimensions = input.Dimensions,
            PricePerDay = input.PricePerDay,
            InstallationFee = input.InstallationFee,
            MinDuration = input.MinDuration,
            MaxDuration = input.MaxDuration,
            Images = input.Images ?? [],
            AvailableFrom = input.AvailableFrom,
            AvailableTo = input.AvailableTo,
            DimensionsText = input.DimensionsText,
            Traffic = input.Traffic,
            CreatedAt = DateTime.UtcNow
        };

        return await repository.AddAsync(space, ct);
    }

    private async Task<(double Latitude, double Longitude)> ResolveCoordinatesAsync(
        double? latitude, double? longitude,
        string address, string city, string state, string? zipCode,
        CancellationToken ct) {
        if (latitude.HasValue && longitude.HasValue)
            return (latitude.Value, longitude.Value);

        var result = await geocodingService.GeocodeAddressAsync(address, city, state, zipCode, ct);
        return (result.Latitude, result.Longitude);
    }

    public async Task<Space> UpdateAsync(Guid userId, Guid id, UpdateSpaceInput input, CancellationToken ct) {
        if (input.PricePerDay is < 0)
            throw new ValidationException("PricePerDay", "Price cannot be negative");

        var space = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Space", id);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("update this space");

        var coordinates = await ResolveCoordinatesForUpdateAsync(space, input, ct);
        return await repository.UpdateAsync(space, input, coordinates, ct);
    }

    private async Task<(double Latitude, double Longitude)?> ResolveCoordinatesForUpdateAsync(
        Space space, UpdateSpaceInput input, CancellationToken ct) {
        if (input.Latitude.HasValue && input.Longitude.HasValue)
            return (input.Latitude.Value, input.Longitude.Value);

        var addressChanged = input.Address is not null && input.Address != space.Address;
        var cityChanged = input.City is not null && input.City != space.City;
        var stateChanged = input.State is not null && input.State != space.State;
        var zipCodeChanged = input.ZipCode is not null && input.ZipCode != space.ZipCode;

        if (!addressChanged && !cityChanged && !stateChanged && !zipCodeChanged)
            return null;

        var address = input.Address ?? space.Address;
        var city = input.City ?? space.City;
        var state = input.State ?? space.State;
        var zipCode = input.ZipCode ?? space.ZipCode;

        var result = await geocodingService.GeocodeAddressAsync(address, city, state, zipCode, ct);
        return (result.Latitude, result.Longitude);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct) {
        var space = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Space", id);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("delete this space");

        if (await repository.HasActiveBookingsAsync(id, ct))
            throw new ConflictException("Space", "Cannot delete space with active bookings");

        return await repository.DeleteAsync(space, ct);
    }

    public async Task<Space> DeactivateAsync(Guid userId, Guid id, CancellationToken ct) {
        var space = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Space", id);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("deactivate this space");

        if (await repository.HasActiveBookingsAsync(id, ct))
            throw new ConflictException("Space", "Cannot deactivate space with active bookings");

        return await repository.UpdateStatusAsync(space, SpaceStatus.Inactive, ct);
    }

    public async Task<Space> ReactivateAsync(Guid userId, Guid id, CancellationToken ct) {
        var space = await repository.GetByIdWithOwnerAsync(id, ct)
            ?? throw new NotFoundException("Space", id);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("reactivate this space");

        return await repository.UpdateStatusAsync(space, SpaceStatus.Active, ct);
    }
}
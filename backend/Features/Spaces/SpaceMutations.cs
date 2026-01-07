using ElaviewBackend.Features.Users;
using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Spaces;

[MutationType]
public static partial class SpaceMutations {
    [Authorize]
    public static async Task<Space> CreateSpace(
        CreateSpaceInput input,
        AppDbContext context,
        UserService userService,
        CancellationToken ct
    ) {
        var userId = userService.PrincipalId();
        var user = await context.Users
            .Include(u => u.ActiveProfile)
            .FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new Exception("User not found");

        if (user.ActiveProfile == null ||
            user.ActiveProfile.ProfileType != ProfileType.SpaceOwner) {
            throw new Exception(
                "User must have an active SpaceOwner profile to create spaces");
        }

        var space = new Space {
            Id = Guid.NewGuid().ToString(),
            OwnerProfile = user.ActiveProfile,
            Title = input.Title,
            Description = input.Description,
            Type = input.Type,
            Status = SpaceStatus.Active,
            Address = input.Address,
            City = input.City,
            State = input.State,
            ZipCode = input.ZipCode,
            Latitude = input.Latitude,
            Longitude = input.Longitude,
            Width = input.Width,
            Height = input.Height,
            Dimensions = input.Dimensions,
            PricePerDay = input.PricePerDay,
            InstallationFee = input.InstallationFee,
            MinDuration = input.MinDuration,
            MaxDuration = input.MaxDuration,
            Images = input.Images ?? new List<string>(),
            AvailableFrom = input.AvailableFrom,
            AvailableTo = input.AvailableTo,
            DimensionsText = input.DimensionsText,
            Traffic = input.Traffic,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }

    [Authorize]
    public static async Task<Space> DeleteSpace(
        [ID] string id,
        AppDbContext context,
        CancellationToken ct
    ) {
        var space = await context.Spaces.FirstOrDefaultAsync(
            s => s.Id == id, ct
        ) ?? throw new Exception("Space not found");

        context.Spaces.Remove(space);
        await context.SaveChangesAsync(ct);
        return space;
    }
}
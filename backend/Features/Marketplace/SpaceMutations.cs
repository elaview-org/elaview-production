using ElaviewBackend.Features.Users;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class SpaceMutations {
    [Authorize]
    public static async Task<Space> CreateSpace(
        CreateSpaceInput input, AppDbContext context,
        UserService userService, CancellationToken ct
    ) {
        var userId = userService.PrincipalId();
        var user = await context.Users
                       .FirstOrDefaultAsync(u => u.Id.ToString() == userId, ct)
                   ?? throw new Exception("User not found");

        var spaceOwnerProfile =
            await context.SpaceOwnerProfiles.FirstOrDefaultAsync(p =>
                p.Id == user.SpaceOwnerProfile!.Id, ct);
        var space = new Space {
            SpaceOwnerProfileId = spaceOwnerProfile!.Id,
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
            Images = input.Images ?? [],
            AvailableFrom = input.AvailableFrom,
            AvailableTo = input.AvailableTo,
            DimensionsText = input.DimensionsText,
            Traffic = input.Traffic,
            CreatedAt = DateTime.UtcNow,
        };

        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }

    [Authorize]
    public static async Task<Space> DeleteSpace(
        [ID] Guid id, AppDbContext context, CancellationToken ct
    ) {
        var space = await context.Spaces.FirstOrDefaultAsync(
            s => s.Id == id, ct
        ) ?? throw new Exception("Space not found");

        context.Spaces.Remove(space);
        await context.SaveChangesAsync(ct);
        return space;
    }
}
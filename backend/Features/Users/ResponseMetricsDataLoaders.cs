using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

public record ResponseMetrics(float ResponseRate, int AverageResponseTimeHours);

internal static class ResponseMetricsDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ResponseMetrics>>
        GetResponseMetricsBySpaceOwnerProfileId(
            IReadOnlyList<Guid> profileIds, AppDbContext context, CancellationToken ct) {
        var bookingData = await context.Bookings
            .Where(b => profileIds.Contains(b.Space.SpaceOwnerProfileId))
            .Select(b => new {
                ProfileId = b.Space.SpaceOwnerProfileId,
                b.Status,
                b.CreatedAt,
                b.UpdatedAt
            })
            .ToListAsync(ct);

        var result = new Dictionary<Guid, ResponseMetrics>();

        foreach (var profileId in profileIds) {
            var profileBookings = bookingData
                .Where(b => b.ProfileId == profileId)
                .ToList();

            if (profileBookings.Count == 0) {
                result[profileId] = new ResponseMetrics(0f, 0);
                continue;
            }

            var respondedBookings = profileBookings
                .Where(b => b.Status != BookingStatus.PendingApproval)
                .ToList();

            var responseRate = profileBookings.Count > 0
                ? (float)respondedBookings.Count / profileBookings.Count * 100
                : 0f;

            var averageResponseTimeHours = respondedBookings.Count > 0
                ? (int)respondedBookings
                    .Average(b => (b.UpdatedAt - b.CreatedAt).TotalHours)
                : 0;

            result[profileId] = new ResponseMetrics(responseRate, averageResponseTimeHours);
        }

        return result;
    }
}

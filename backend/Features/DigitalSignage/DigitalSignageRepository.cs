using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.DigitalSignage;

public interface IDigitalSignageRepository {
    IQueryable<DigitalSignageScreen> QueryScreens();
    IQueryable<DigitalSignageDevice> QueryDevices();
    IQueryable<DigitalSignageSchedule> QuerySchedules();
    IQueryable<DigitalSignageProofEvent> QueryProofEvents();

    Task<Space?> GetOwnedSpaceAsync(Guid userId, Guid spaceId,
        CancellationToken ct);

    Task<DigitalSignageScreen?> GetOwnedScreenAsync(Guid userId, Guid screenId,
        CancellationToken ct);

    Task<DigitalSignageScreen?> GetScreenByIdAsync(Guid id, CancellationToken ct);

    Task<DigitalSignageScreen?> GetScreenBySpaceIdAsync(Guid spaceId,
        CancellationToken ct);

    Task<DigitalSignageDevice?> GetByPairingCodeAsync(string pairingCode,
        CancellationToken ct);

    Task<DigitalSignageDevice?> GetByDeviceTokenAsync(string deviceToken,
        CancellationToken ct);

    Task<DigitalSignageSchedule?> GetScheduleByIdAsync(Guid scheduleId,
        CancellationToken ct);

    Task<DigitalSignageScreen> AddScreenAsync(DigitalSignageScreen screen,
        CancellationToken ct);

    Task<DigitalSignageDevice> AddDeviceAsync(DigitalSignageDevice device,
        CancellationToken ct);

    Task<DigitalSignageSchedule> AddScheduleAsync(DigitalSignageSchedule schedule,
        CancellationToken ct);

    Task<DigitalSignageProofEvent> AddProofEventAsync(
        DigitalSignageProofEvent proofEvent, CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class DigitalSignageRepository(AppDbContext context)
    : IDigitalSignageRepository {
    public IQueryable<DigitalSignageScreen> QueryScreens()
        => context.DigitalSignageScreens;

    public IQueryable<DigitalSignageDevice> QueryDevices()
        => context.DigitalSignageDevices;

    public IQueryable<DigitalSignageSchedule> QuerySchedules()
        => context.DigitalSignageSchedules;

    public IQueryable<DigitalSignageProofEvent> QueryProofEvents()
        => context.DigitalSignageProofEvents;

    public async Task<Space?> GetOwnedSpaceAsync(Guid userId, Guid spaceId,
        CancellationToken ct)
        => await context.Spaces
            .Include(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(
                s => s.Id == spaceId && s.SpaceOwnerProfile.UserId == userId, ct);

    public async Task<DigitalSignageScreen?> GetOwnedScreenAsync(Guid userId,
        Guid screenId, CancellationToken ct)
        => await context.DigitalSignageScreens
            .Include(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(
                s => s.Id == screenId && s.SpaceOwnerProfile.UserId == userId, ct);

    public async Task<DigitalSignageScreen?> GetScreenByIdAsync(Guid id,
        CancellationToken ct)
        => await context.DigitalSignageScreens.FirstOrDefaultAsync(s => s.Id == id,
            ct);

    public async Task<DigitalSignageScreen?> GetScreenBySpaceIdAsync(
        Guid spaceId, CancellationToken ct)
        => await context.DigitalSignageScreens
            .FirstOrDefaultAsync(s => s.SpaceId == spaceId, ct);

    public async Task<DigitalSignageDevice?> GetByPairingCodeAsync(
        string pairingCode, CancellationToken ct)
        => await context.DigitalSignageDevices
            .Include(d => d.Screen)
            .FirstOrDefaultAsync(d => d.PairingCode == pairingCode, ct);

    public async Task<DigitalSignageDevice?> GetByDeviceTokenAsync(
        string deviceToken, CancellationToken ct)
        => await context.DigitalSignageDevices
            .Include(d => d.Screen)
            .FirstOrDefaultAsync(d => d.DeviceToken == deviceToken, ct);

    public async Task<DigitalSignageSchedule?> GetScheduleByIdAsync(
        Guid scheduleId, CancellationToken ct)
        => await context.DigitalSignageSchedules
            .FirstOrDefaultAsync(s => s.Id == scheduleId, ct);

    public async Task<DigitalSignageScreen> AddScreenAsync(
        DigitalSignageScreen screen, CancellationToken ct) {
        context.DigitalSignageScreens.Add(screen);
        await context.SaveChangesAsync(ct);
        return screen;
    }

    public async Task<DigitalSignageDevice> AddDeviceAsync(
        DigitalSignageDevice device, CancellationToken ct) {
        context.DigitalSignageDevices.Add(device);
        await context.SaveChangesAsync(ct);
        return device;
    }

    public async Task<DigitalSignageSchedule> AddScheduleAsync(
        DigitalSignageSchedule schedule, CancellationToken ct) {
        context.DigitalSignageSchedules.Add(schedule);
        await context.SaveChangesAsync(ct);
        return schedule;
    }

    public async Task<DigitalSignageProofEvent> AddProofEventAsync(
        DigitalSignageProofEvent proofEvent, CancellationToken ct) {
        context.DigitalSignageProofEvents.Add(proofEvent);
        await context.SaveChangesAsync(ct);
        return proofEvent;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using ElaviewBackend.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Features.DigitalSignage;

public interface IDigitalSignageService {
    // ── Screen ───────────────────────────────────────────
    IQueryable<DigitalSignageScreen> GetScreensByOwner(Guid userId);
    IQueryable<DigitalSignageScreen> GetScreenById(Guid screenId);

    Task<DigitalSignageScreen> RegisterScreenAsync(
        Guid userId, CreateDigitalSignageScreenInput input, CancellationToken ct);

    // ── Device / Pairing ─────────────────────────────────
    Task<(DigitalSignageDevice Device, string PairingCode, DateTime ExpiresAt)>
        GeneratePairingCodeAsync(Guid userId, GeneratePairingCodeInput input,
            CancellationToken ct);

    Task<DigitalSignageDevice> CompletePairingAsync(
        PairDigitalSignageDeviceInput input, CancellationToken ct);

    // ── Schedule ─────────────────────────────────────────
    IQueryable<DigitalSignageSchedule> GetSchedulesForScreen(Guid screenId);

    Task<DigitalSignageSchedule> CreateScheduleAsync(
        Guid userId, CreateDigitalSignageScheduleInput input,
        CancellationToken ct);

    /// <summary>
    /// Called after a booking is paid. If the booking's space is a DigitalDisplay
    /// with a registered screen, auto-creates a schedule. Silently no-ops otherwise.
    /// </summary>
    Task TryAutoScheduleForBookingAsync(Guid bookingId, CancellationToken ct);

    // ── Proof Events ─────────────────────────────────────
    IQueryable<DigitalSignageProofEvent> GetProofEventsForBooking(Guid bookingId);

    Task<DigitalSignageProofEvent> RecordProofEventAsync(
        RecordDigitalSignageProofEventInput input, CancellationToken ct);
}

public sealed class DigitalSignageService(
    IDigitalSignageRepository repository,
    AppDbContext dbContext,
    IHttpClientFactory httpClientFactory,
    IOptions<GlobalSettings> globalSettings,
    ILogger<DigitalSignageService> logger
) : IDigitalSignageService {

    private readonly SignalingSettings _signaling = globalSettings.Value.Signaling;

    // ── Screen ───────────────────────────────────────────

    public IQueryable<DigitalSignageScreen> GetScreensByOwner(Guid userId)
        => repository.QueryScreens()
            .Where(s => s.SpaceOwnerProfile.UserId == userId)
            .OrderByDescending(s => s.CreatedAt);

    public IQueryable<DigitalSignageScreen> GetScreenById(Guid screenId)
        => repository.QueryScreens().Where(s => s.Id == screenId);

    public async Task<DigitalSignageScreen> RegisterScreenAsync(
        Guid userId, CreateDigitalSignageScreenInput input,
        CancellationToken ct) {
        if (string.IsNullOrWhiteSpace(input.Name))
            throw new ValidationException("Name", "Screen name is required");

        var space = await repository.GetOwnedSpaceAsync(userId, input.SpaceId, ct)
                    ?? throw new NotFoundException("Space", input.SpaceId);

        var screen = new DigitalSignageScreen {
            SpaceId = space.Id,
            SpaceOwnerProfileId = space.SpaceOwnerProfile.Id,
            Name = input.Name,
            Resolution = input.Resolution,
            Status = DigitalSignageScreenStatus.Offline,
            UpdatedAt = DateTime.UtcNow
        };

        return await repository.AddScreenAsync(screen, ct);
    }

    // ── Device / Pairing ─────────────────────────────────

    public async Task<(DigitalSignageDevice Device, string PairingCode,
        DateTime ExpiresAt)> GeneratePairingCodeAsync(
        Guid userId, GeneratePairingCodeInput input, CancellationToken ct) {
        var screen =
            await repository.GetOwnedScreenAsync(userId, input.ScreenId, ct)
            ?? throw new NotFoundException("Screen", input.ScreenId);

        var code = GenerateSecurePairingCode();
        var expiresAt = DateTime.UtcNow.AddMinutes(10);

        var device = new DigitalSignageDevice {
            ScreenId = screen.Id,
            DeviceToken = string.Empty, // set on pairing completion
            DeviceName = "Pending pairing",
            Type = DigitalSignageDeviceType.Other,
            Status = DigitalSignageDeviceStatus.Pairing,
            PairingCode = code,
            PairingCodeExpiresAt = expiresAt,
            UpdatedAt = DateTime.UtcNow
        };

        device = await repository.AddDeviceAsync(device, ct);
        return (device, code, expiresAt);
    }

    public async Task<DigitalSignageDevice> CompletePairingAsync(
        PairDigitalSignageDeviceInput input, CancellationToken ct) {
        if (string.IsNullOrWhiteSpace(input.PairingCode))
            throw new ValidationException("PairingCode",
                "Pairing code is required");

        if (string.IsNullOrWhiteSpace(input.DeviceToken))
            throw new ValidationException("DeviceToken",
                "Device token is required");

        var device =
            await repository.GetByPairingCodeAsync(input.PairingCode, ct)
            ?? throw new ValidationException("PairingCode",
                "Invalid or expired pairing code");

        if (device.Status != DigitalSignageDeviceStatus.Pairing)
            throw new ConflictException("Device",
                "Device is not in pairing state");

        if (device.PairingCodeExpiresAt.HasValue &&
            device.PairingCodeExpiresAt.Value < DateTime.UtcNow)
            throw new ValidationException("PairingCode",
                "Pairing code has expired");

        // Check if DeviceToken is already in use
        var existing =
            await repository.GetByDeviceTokenAsync(input.DeviceToken, ct);
        if (existing is not null)
            throw new ConflictException("DeviceToken",
                "Device token is already registered");

        device.DeviceName = input.DeviceName;
        device.Status = DigitalSignageDeviceStatus.Online;
        device.PairingCode = null;
        device.PairingCodeExpiresAt = null;
        device.LastSeenAt = DateTime.UtcNow;
        device.UpdatedAt = DateTime.UtcNow;

        // Use reflection-free approach: set via context tracking
        await repository.SaveChangesAsync(ct);
        return device;
    }

    // ── Schedule ─────────────────────────────────────────

    public IQueryable<DigitalSignageSchedule> GetSchedulesForScreen(
        Guid screenId
    ) => repository.QuerySchedules()
        .Where(s => s.ScreenId == screenId)
        .OrderByDescending(s => s.StartDate);

    public async Task<DigitalSignageSchedule> CreateScheduleAsync(
        Guid userId, CreateDigitalSignageScheduleInput input,
        CancellationToken ct) {
        if (string.IsNullOrWhiteSpace(input.CreativeAssetUrl))
            throw new ValidationException("CreativeAssetUrl",
                "Creative asset URL is required");

        if (input.StartDate >= input.EndDate)
            throw new ValidationException("EndDate",
                "End date must be after start date");

        if (input.RotationIntervalSeconds < 5)
            throw new ValidationException("RotationIntervalSeconds",
                "Rotation interval must be at least 5 seconds");

        var screen =
            await repository.GetOwnedScreenAsync(userId, input.ScreenId, ct)
            ?? throw new NotFoundException("Screen", input.ScreenId);

        var schedule = new DigitalSignageSchedule {
            ScreenId = screen.Id,
            BookingId = input.BookingId,
            CampaignId = input.CampaignId,
            CreativeAssetUrl = input.CreativeAssetUrl,
            CreativeType = input.CreativeType,
            RotationIntervalSeconds = input.RotationIntervalSeconds,
            StartDate = input.StartDate,
            EndDate = input.EndDate,
            Status = DigitalSignageScheduleStatus.Pending,
            UpdatedAt = DateTime.UtcNow
        };

        return await repository.AddScheduleAsync(schedule, ct);
    }

    // ── Proof Events ─────────────────────────────────────

    public IQueryable<DigitalSignageProofEvent> GetProofEventsForBooking(
        Guid bookingId
    ) => repository.QueryProofEvents()
        .Where(e => e.BookingId == bookingId)
        .OrderByDescending(e => e.DisplayedAt);

    public async Task<DigitalSignageProofEvent> RecordProofEventAsync(
        RecordDigitalSignageProofEventInput input, CancellationToken ct) {
        if (string.IsNullOrWhiteSpace(input.DeviceToken))
            throw new ValidationException("DeviceToken",
                "Device token is required");

        if (input.DisplayedDurationSeconds <= 0)
            throw new ValidationException("DisplayedDurationSeconds",
                "Duration must be positive");

        var device =
            await repository.GetByDeviceTokenAsync(input.DeviceToken, ct)
            ?? throw new ValidationException("DeviceToken",
                "Unknown device token");

        if (device.Status != DigitalSignageDeviceStatus.Online)
            throw new ConflictException("Device",
                "Device is not in online state");

        var schedule =
            await repository.GetScheduleByIdAsync(input.ScheduleId, ct)
            ?? throw new NotFoundException("Schedule", input.ScheduleId);

        var proofEvent = new DigitalSignageProofEvent {
            ScreenId = device.ScreenId,
            DeviceId = device.Id,
            ScheduleId = schedule.Id,
            BookingId = input.BookingId,
            DisplayedAt = input.DisplayedAt,
            DisplayedDurationSeconds = input.DisplayedDurationSeconds,
            Metadata = input.Metadata
        };

        return await repository.AddProofEventAsync(proofEvent, ct);
    }

    // ── Auto-Schedule Hook ─────────────────────────────────

    public async Task TryAutoScheduleForBookingAsync(Guid bookingId,
        CancellationToken ct) {
        // Load booking with space and campaign info
        var booking = await dbContext.Bookings
            .Include(b => b.Space)
            .Include(b => b.Campaign)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);

        if (booking is null) return;

        // Only auto-schedule for DigitalDisplay spaces
        if (booking.Space.Type != SpaceType.DigitalDisplay) return;

        // Find the screen registered for this space
        var screen = await repository.GetScreenBySpaceIdAsync(
            booking.SpaceId, ct);

        // If no screen is registered yet, skip — the owner can manually
        // create a schedule after registering a screen
        if (screen is null) return;

        // Don't duplicate if a schedule already exists for this booking
        var existingSchedule = await repository.QuerySchedules()
            .AnyAsync(s => s.BookingId == bookingId, ct);
        if (existingSchedule) return;

        // Check for overlapping schedules on the same screen
        var hasOverlap = await repository.QuerySchedules()
            .AnyAsync(s =>
                s.ScreenId == screen.Id &&
                s.Status != DigitalSignageScheduleStatus.Cancelled &&
                s.StartDate < booking.EndDate &&
                s.EndDate > booking.StartDate, ct);
        if (hasOverlap) {
            logger.LogWarning(
                "Skipping auto-schedule for booking {BookingId}: overlapping schedule exists on screen {ScreenId}",
                bookingId, screen.Id);
            return;
        }

        var schedule = new DigitalSignageSchedule {
            ScreenId = screen.Id,
            BookingId = booking.Id,
            CampaignId = booking.CampaignId,
            CreativeAssetUrl = booking.Campaign.ImageUrl,
            CreativeType = DigitalSignageCreativeType.Image,
            RotationIntervalSeconds = 30,
            StartDate = booking.StartDate,
            EndDate = booking.EndDate,
            Status = DigitalSignageScheduleStatus.Pending,
            UpdatedAt = DateTime.UtcNow
        };

        await repository.AddScheduleAsync(schedule, ct);

        // Notify signaling service so connected devices get the schedule in real time
        await TryPushScheduleToSignalingAsync(screen.Id, schedule, ct);
    }

    // ── Signaling Push ───────────────────────────────────

    private async Task TryPushScheduleToSignalingAsync(
        Guid screenId, DigitalSignageSchedule schedule,
        CancellationToken ct) {
        try {
            if (string.IsNullOrEmpty(_signaling.BaseUrl)) return;

            var client = httpClientFactory.CreateClient("Signaling");
            var payload = new {
                screenId = screenId.ToString(),
                schedules = new[] {
                    new {
                        id = schedule.Id.ToString(),
                        screenId = screenId.ToString(),
                        bookingId = schedule.BookingId.ToString(),
                        campaignId = schedule.CampaignId.ToString(),
                        creativeAssetUrl = schedule.CreativeAssetUrl,
                        creativeType = schedule.CreativeType.ToString(),
                        rotationIntervalSeconds = schedule.RotationIntervalSeconds,
                        startDate = schedule.StartDate.ToString("o"),
                        endDate = schedule.EndDate.ToString("o"),
                        status = schedule.Status.ToString()
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{_signaling.BaseUrl}/api/push-schedule") {
                Content = new StringContent(json, Encoding.UTF8,
                    "application/json")
            };
            request.Headers.Add("Authorization",
                $"Bearer {_signaling.WebhookSecret}");

            var response = await client.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode) {
                logger.LogWarning(
                    "Signaling push failed: {StatusCode}",
                    response.StatusCode);
            }
        }
        catch (Exception ex) {
            // Never let signaling failures break the payment flow
            logger.LogWarning(ex,
                "Failed to push schedule to signaling service");
        }
    }

    // ── Helpers ──────────────────────────────────────────

    private static string GenerateSecurePairingCode() {
        var bytes = RandomNumberGenerator.GetBytes(3);
        var code = (BitConverter.ToUInt32([bytes[0], bytes[1], bytes[2], 0], 0)
                    % 1_000_000).ToString("D6");
        return code;
    }
}

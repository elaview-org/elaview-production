using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.DigitalSignage;

[MutationType]
public static partial class DigitalSignageMutations {

    // ── Screen ───────────────────────────────────────────

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<CreateDigitalSignageScreenPayload>
        RegisterDigitalSignageScreen(
            CreateDigitalSignageScreenInput input,
            IUserService userService,
            IDigitalSignageService signageService,
            CancellationToken ct
        ) {
        var screen = await signageService.RegisterScreenAsync(
            userService.GetPrincipalId(), input, ct);
        return new CreateDigitalSignageScreenPayload(screen);
    }

    // ── Device Pairing ───────────────────────────────────

    [Authorize]
    [Error<NotFoundException>]
    public static async Task<GeneratePairingCodePayload>
        GenerateDevicePairingCode(
            GeneratePairingCodeInput input,
            IUserService userService,
            IDigitalSignageService signageService,
            CancellationToken ct
        ) {
        var (_, code, expiresAt) =
            await signageService.GeneratePairingCodeAsync(
                userService.GetPrincipalId(), input, ct);
        return new GeneratePairingCodePayload(code, expiresAt);
    }

    [Error<ValidationException>]
    [Error<ConflictException>]
    public static async Task<PairDigitalSignageDevicePayload>
        PairDigitalSignageDevice(
            PairDigitalSignageDeviceInput input,
            IDigitalSignageService signageService,
            CancellationToken ct
        ) {
        var device = await signageService.CompletePairingAsync(input, ct);
        return new PairDigitalSignageDevicePayload(device);
    }

    // ── Schedule ─────────────────────────────────────────

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<CreateDigitalSignageSchedulePayload>
        CreateDigitalSignageSchedule(
            CreateDigitalSignageScheduleInput input,
            IUserService userService,
            IDigitalSignageService signageService,
            CancellationToken ct
        ) {
        var schedule = await signageService.CreateScheduleAsync(
            userService.GetPrincipalId(), input, ct);
        return new CreateDigitalSignageSchedulePayload(schedule);
    }

    // ── Proof Event ──────────────────────────────────────

    [Error<ValidationException>]
    [Error<NotFoundException>]
    [Error<ConflictException>]
    public static async Task<RecordDigitalSignageProofEventPayload>
        RecordDigitalSignageProofEvent(
            RecordDigitalSignageProofEventInput input,
            IDigitalSignageService signageService,
            CancellationToken ct
        ) {
        var proofEvent =
            await signageService.RecordProofEventAsync(input, ct);
        return new RecordDigitalSignageProofEventPayload(proofEvent);
    }
}

using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.DigitalSignage;

public record CreateDigitalSignageScreenPayload(DigitalSignageScreen Screen);

public record GeneratePairingCodePayload(string PairingCode, DateTime ExpiresAt);

public record PairDigitalSignageDevicePayload(DigitalSignageDevice Device);

public record CreateDigitalSignageSchedulePayload(
    DigitalSignageSchedule Schedule);

public record RecordDigitalSignageProofEventPayload(
    DigitalSignageProofEvent ProofEvent);
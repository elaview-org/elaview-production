using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.DigitalSignage;

public record CreateDigitalSignageScreenInput(
    [property: ID] Guid SpaceId,
    string Name,
    string? Resolution
);

public record GeneratePairingCodeInput(
    [property: ID] Guid ScreenId
);

public record PairDigitalSignageDeviceInput(
    string PairingCode,
    string DeviceToken,
    string DeviceName,
    DigitalSignageDeviceType Type
);

public record CreateDigitalSignageScheduleInput(
    [property: ID] Guid ScreenId,
    [property: ID] Guid BookingId,
    [property: ID] Guid CampaignId,
    string CreativeAssetUrl,
    DigitalSignageCreativeType CreativeType,
    int RotationIntervalSeconds,
    DateTime StartDate,
    DateTime EndDate
);

public record RecordDigitalSignageProofEventInput(
    string DeviceToken,
    [property: ID] Guid ScheduleId,
    [property: ID] Guid BookingId,
    DateTime DisplayedAt,
    int DisplayedDurationSeconds,
    string? Metadata
);
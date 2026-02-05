using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Analytics;

[InterfaceType("ActivityEvent")]
public interface IActivityEvent {
    Guid Id { get; }
    string Type { get; }
    DateTime Timestamp { get; }
}

[ObjectType("BookingActivity")]
public record BookingActivity : IActivityEvent {
    public Guid Id { get; init; }
    public required string Type { get; init; }
    public DateTime Timestamp { get; init; }
    public required Booking Booking { get; init; }
}

[ObjectType("PaymentActivity")]
public record PaymentActivity : IActivityEvent {
    public Guid Id { get; init; }
    public required string Type { get; init; }
    public DateTime Timestamp { get; init; }
    public required Payment Payment { get; init; }
}

[ObjectType("ProofActivity")]
public record ProofActivity : IActivityEvent {
    public Guid Id { get; init; }
    public required string Type { get; init; }
    public DateTime Timestamp { get; init; }
    public required BookingProof Proof { get; init; }
}

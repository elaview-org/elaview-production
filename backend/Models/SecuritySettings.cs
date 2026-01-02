namespace ElaviewBackend.Models;

public class SecuritySettings {
    public bool TwoFactorEnabled { get; init; } = false;
    public bool LoginNotifications { get; init; } = true;

    public ICollection<DeviceSession> DeviceSessions { get; init; } =
        new List<DeviceSession> { new() };

    public class DeviceSession {
        public string Id { get; init; } = "session_current";
        public string Device { get; init; } = "Current Browser";
        public string Location { get; init; } = "Orange, CA, US";
        public DateTime LastActive { get; init; } = new DateTime();
        public bool Current { get; init; } = true;
    }
}
namespace ElaviewBackend.Models;

public sealed class NotificationSettings {
    public bool BookingRequests { get; init; } = true;
    public bool BookingApprovals { get; init; } = true;
    public bool PaymentReceipts { get; init; } = true;
    public bool CampaignUpdates { get; init; } = true;
    public bool MarketingEmails { get; init; } = true;
    public bool SystemNotifications { get; init; } = true;
    public string EmailDigest { get; init; } = "weekly";
}
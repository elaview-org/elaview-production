namespace ElaviewBackend.Data.Entities;

public enum UserRole {
    Advertiser,
    SpaceOwner,
    Admin,
    Marketing
}

public enum UserStatus {
    Active,
    Suspended,
    Deleted
}

public enum SpaceType {
    Billboard,
    Storefront,
    Transit,
    DigitalDisplay,
    WindowDisplay,
    VehicleWrap,
    Other
}

public enum SpaceStatus {
    Active,
    Inactive,
    PendingApproval,
    Suspended,
    Rejected
}

public enum CampaignStatus {
    Draft,
    Submitted,
    Active,
    Completed,
    Cancelled
}

public enum BookingStatus {
    PendingApproval,
    Approved,
    Confirmed,
    Active,
    AwaitingProof,
    Completed,
    Cancelled,
    Rejected,
    PendingBalance,
    Disputed
}

public enum PaymentType {
    Immediate,
    Deposit
}

public enum PayoutStatus {
    Pending,
    Processing,
    PartiallyPaid,
    Completed,
    Failed
}

public enum ProofStatus {
    Pending,
    Approved,
    Disputed,
    Rejected,
    UnderReview,
    CorrectionRequested
}

public enum MessageType {
    Text,
    ProofSubmission,
    ProofApproved,
    ProofDisputed,
    System,
    ProofRejected,
    CorrectionRequest,
    QualityConcern
}

public enum PayoutSchedule {
    Weekly,
    Biweekly,
    Monthly
}

public enum NotificationType {
    BookingRequested,
    BookingApproved,
    BookingRejected,
    PaymentReceived,
    ProofUploaded,
    MessageReceived,
    SystemUpdate,
    PayoutProcessed,
    SpaceApproved,
    SpaceRejected,
    SpaceSuspended,
    SpaceReactivated,
    SessionExpired,
    PaymentFailed,
    ProofApproved,
    ProofDisputed,
    ProofRejected,
    RefundProcessed,
    BookingCancelled,
    PaymentReminder,
    DisputeFiled
}

public enum ReviewerType {
    Advertiser,
    SpaceOwner
}

public enum DisputeIssueType {
    WrongLocation,
    PoorQuality,
    DamageToCreative,
    NotVisible,
    SafetyIssue,
    MisleadingListing
}

public enum BugCategory {
    UiUx,
    Payment,
    Messaging,
    Authentication,
    Booking,
    SpaceManagement,
    Campaign,
    Notifications,
    Performance,
    DataIntegrity,
    Other
}

public enum BugSeverity {
    Critical,
    High,
    Medium,
    Low
}

public enum BugStatus {
    New,
    Confirmed,
    InProgress,
    Fixed,
    WontFix,
    Duplicate
}

public enum TriState {
    Yes,
    No,
    Unknown
}

public enum LeadSource {
    GoogleMaps,
    LinkedIn,
    Referral,
    ColdOutreach,
    TradeShow,
    Website,
    Other
}

public enum BusinessType {
    SignCompany,
    BillboardOperator,
    WrapInstaller,
    PropertyManager,
    PrintShop,
    Agency,
    Other
}

public enum LeadStatus {
    New,
    Contacted,
    Responded,
    DemoScheduled,
    SignedUp,
    FollowUp,
    NotInterested
}

public enum OutreachChannel {
    Email,
    LinkedIn,
    Phone,
    WhatsApp,
    InPerson,
    Other
}

public enum OutreachMessageType {
    Initial,
    FollowUp1,
    FollowUp2,
    FollowUp3,
    DemoInvite,
    CheckIn
}

public enum Scale {
    Small,
    Medium,
    Large,
    Enterprise,
    UnknownScale
}

public enum PartnerStatus {
    Prospect,
    Active,
    Inactive,
    Churned
}
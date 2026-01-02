namespace ElaviewBackend.Data;

public enum UserRole
{
    ADVERTISER,
    SPACE_OWNER,
    ADMIN,
    MARKETING
}

public enum UserStatus
{
    ACTIVE,
    SUSPENDED,
    DELETED
}

public enum SpaceType
{
    BILLBOARD,
    STOREFRONT,
    TRANSIT,
    DIGITAL_DISPLAY,
    WINDOW_DISPLAY,
    VEHICLE_WRAP,
    OTHER
}

public enum SpaceStatus
{
    ACTIVE,
    INACTIVE,
    PENDING_APPROVAL,
    SUSPENDED,
    REJECTED
}

public enum CampaignStatus
{
    DRAFT,
    SUBMITTED,
    ACTIVE,
    COMPLETED,
    CANCELLED
}

public enum BookingStatus
{
    PENDING_APPROVAL,
    APPROVED,
    CONFIRMED,
    ACTIVE,
    AWAITING_PROOF,
    COMPLETED,
    CANCELLED,
    REJECTED,
    PENDING_BALANCE,
    DISPUTED
}

public enum PaymentType
{
    IMMEDIATE,
    DEPOSIT
}

public enum PayoutStatus
{
    PENDING,
    PROCESSING,
    PARTIALLY_PAID,
    COMPLETED,
    FAILED
}

public enum ProofStatus
{
    PENDING,
    APPROVED,
    DISPUTED,
    REJECTED,
    UNDER_REVIEW,
    CORRECTION_REQUESTED
}

public enum MessageType
{
    TEXT,
    PROOF_SUBMISSION,
    PROOF_APPROVED,
    PROOF_DISPUTED,
    SYSTEM,
    PROOF_REJECTED,
    CORRECTION_REQUEST,
    QUALITY_CONCERN
}

public enum PayoutSchedule
{
    WEEKLY,
    BIWEEKLY,
    MONTHLY
}

public enum NotificationType
{
    BOOKING_REQUEST,
    BOOKING_APPROVED,
    BOOKING_REJECTED,
    PAYMENT_RECEIVED,
    PROOF_UPLOADED,
    MESSAGE_RECEIVED,
    SYSTEM_UPDATE,
    PAYOUT_PROCESSED,
    SPACE_APPROVED,
    SPACE_REJECTED,
    SPACE_SUSPENDED,
    SPACE_REACTIVATED,
    SESSION_EXPIRED,
    PAYMENT_FAILED,
    PROOF_APPROVED,
    PROOF_DISPUTED,
    PROOF_REJECTED,
    REFUND_PROCESSED,
    BOOKING_CANCELLED,
    PAYMENT_REMINDER,
    DISPUTE_FILED
}

public enum ReviewerType
{
    ADVERTISER,
    SPACE_OWNER
}

public enum DisputeIssueType
{
    WRONG_LOCATION,
    POOR_QUALITY,
    DAMAGE_TO_CREATIVE,
    NOT_VISIBLE,
    SAFETY_ISSUE,
    MISLEADING_LISTING
}

public enum BugCategory
{
    UI_UX,
    PAYMENT,
    MESSAGING,
    AUTHENTICATION,
    BOOKING,
    SPACE_MANAGEMENT,
    CAMPAIGN,
    NOTIFICATIONS,
    PERFORMANCE,
    DATA_INTEGRITY,
    OTHER
}

public enum BugSeverity
{
    CRITICAL,
    HIGH,
    MEDIUM,
    LOW
}

public enum BugStatus
{
    NEW,
    CONFIRMED,
    IN_PROGRESS,
    FIXED,
    WONT_FIX,
    DUPLICATE
}

public enum TriState
{
    YES,
    NO,
    UNKNOWN
}

public enum LeadSource
{
    GOOGLE_MAPS,
    LINKEDIN,
    REFERRAL,
    COLD_OUTREACH,
    TRADE_SHOW,
    WEBSITE,
    OTHER
}

public enum BusinessType
{
    SIGN_COMPANY,
    BILLBOARD_OPERATOR,
    WRAP_INSTALLER,
    PROPERTY_MANAGER,
    PRINT_SHOP,
    AGENCY,
    OTHER
}

public enum LeadStatus
{
    NEW,
    CONTACTED,
    RESPONDED,
    DEMO_SCHEDULED,
    SIGNED_UP,
    FOLLOW_UP,
    NOT_INTERESTED
}

public enum OutreachChannel
{
    EMAIL,
    LINKEDIN,
    PHONE,
    WHATSAPP,
    IN_PERSON,
    OTHER
}

public enum OutreachMessageType
{
    INITIAL,
    FOLLOW_UP_1,
    FOLLOW_UP_2,
    FOLLOW_UP_3,
    DEMO_INVITE,
    CHECK_IN
}

public enum Scale
{
    SMALL,
    MEDIUM,
    LARGE,
    ENTERPRISE,
    UNKNOWN_SCALE
}

public enum PartnerStatus
{
    PROSPECT,
    ACTIVE,
    INACTIVE,
    CHURNED
}
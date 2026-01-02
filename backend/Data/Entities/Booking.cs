using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace ElaviewBackend.Data.Entities;

public sealed class Booking
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(50)]
    public string CampaignId { get; init; } = null!;
    [MaxLength(50)]
    public string SpaceId { get; init; } = null!;
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public int TotalDays { get; init; }
    public decimal PricePerDay { get; init; }
    public decimal TotalAmount { get; init; }
    public decimal PlatformFee { get; init; }
    public decimal? StripeFee { get; init; }
    public decimal? TotalWithFees { get; init; }
    public BookingStatus Status { get; set; } = BookingStatus.PendingApproval;
    [MaxLength(255)]
    public string? StripePaymentIntentId { get; init; }
    public DateTime? PaidAt { get; set; }
    public List<string> ProofPhotos { get; init; } = new();
    public DateTime? ProofUploadedAt { get; set; }
    public DateTime? ProofApprovedAt { get; set; }
    [MaxLength(50)]
    public string? ProofApprovedBy { get; init; }
    public bool FirstPayoutProcessed { get; set; } = false;
    public DateTime? FirstPayoutDate { get; set; }
    public decimal? FirstPayoutAmount { get; init; }
    public bool FinalPayoutProcessed { get; set; } = false;
    public DateTime? FinalPayoutDate { get; set; }
    public decimal? FinalPayoutAmount { get; init; }
    public JsonDocument? VerificationSchedule { get; init; }
    public JsonDocument? VerificationPhotos { get; init; }
    public DateTime? NextVerificationDue { get; set; }
    public int MissedVerifications { get; set; } = 0;
    public DateTime? ReservedUntil { get; set; }
    public string? AdvertiserNotes { get; init; }
    public string? OwnerNotes { get; init; }
    public string? AdminNotes { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public decimal? BalanceAmount { get; init; }
    [MaxLength(255)]
    public string? BalanceChargeId { get; init; }
    public DateTime? BalanceDueDate { get; init; }
    public DateTime? BalancePaidAt { get; set; }
    public string? CancellationReason { get; init; }
    public DateTime? CancelledAt { get; set; }
    [MaxLength(50)]
    public string? CancelledBy { get; init; }
    public decimal? DepositAmount { get; init; }
    [MaxLength(255)]
    public string? DepositChargeId { get; init; }
    public DateTime? DepositPaidAt { get; set; }
    [MaxLength(255)]
    public string? StripeChargeId { get; init; }
    [MaxLength(255)]
    public string? DepositStripeChargeId { get; init; }
    [MaxLength(255)]
    public string? BalanceStripeChargeId { get; init; }
    public PaymentType PaymentType { get; init; } = PaymentType.Immediate;
    [MaxLength(50)]
    public string? ProofMessageId { get; init; }
    public ProofStatus? ProofStatus { get; set; }
    public DateTime? QualityGuaranteePeriod { get; init; }
    public decimal? RefundAmount { get; init; }
    public DateTime? RefundProcessedAt { get; set; }
    public decimal SpaceOwnerAmount { get; init; }
    [MaxLength(255)]
    public string? StripeTransferId { get; init; }
    public decimal? TransferAmount { get; init; }
    public DateTime? TransferredAt { get; set; }
    public string? DisputeReason { get; init; }
    public DateTime? DisputedAt { get; set; }
    public string? PayoutError { get; init; }
    public DateTime? PayoutProcessedAt { get; set; }
    public DateTime? RefundedAt { get; set; }
    [MaxLength(255)]
    public string? StripeRefundId { get; init; }
    public int BalanceChargeAttempts { get; set; } = 0;
    public string? BalanceChargeError { get; init; }
    public List<string> CheckpointTransferIds { get; init; } = new();
    [MaxLength(255)]
    public string? FinalTransferId { get; init; }
    public DateTime? FinalTransferredAt { get; set; }
    [MaxLength(255)]
    public string? FirstRentalTransferId { get; init; }
    public DateTime? FirstRentalTransferredAt { get; set; }
    [MaxLength(255)]
    public string? InstallationFeeTransferId { get; init; }
    public DateTime? InstallationFeeTransferredAt { get; set; }
    public DateTime? LastBalanceChargeAttempt { get; set; }
    public DateTime? LastPayoutAttempt { get; set; }
    public int PayoutAttempts { get; set; } = 0;
    public PayoutStatus? PayoutStatus { get; set; }
    public JsonDocument? RefundHistory { get; init; }
    public string? PendingPayoutReason { get; init; }
    public bool IsTestData { get; init; } = false;
    [MaxLength(50)]
    public string? DisputedBy { get; init; }
    public List<string> DisputePhotos { get; init; } = new();
    public DisputeIssueType? DisputeType { get; init; }
    [MaxLength(50)]
    public string? ResolvedBy { get; init; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; init; }
    [MaxLength(50)]
    public string? ResolutionAction { get; init; }
    public Campaign Campaign { get; init; } = null!;
    public Space Space { get; init; } = null!;
    public ICollection<Message> Messages { get; init; } = new List<Message>();
    public Review? Review { get; init; }
}

namespace ElaviewBackend.Tests.Shared.Models;

public record PaymentNode(
    Guid Id,
    string Status,
    decimal Amount,
    string StripePaymentIntentId,
    DateTime? PaidAt
);

public record PaymentByIdResponse(PaymentNode? PaymentById);

public record PaymentsConnection(List<PaymentNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record PaymentsByBookingResponse(PaymentsConnection PaymentsByBooking);

public record PayoutNode(
    Guid Id,
    string Status,
    string Stage,
    decimal Amount,
    DateTime? ProcessedAt
);

public record PayoutByIdResponse(PayoutNode? PayoutById);

public record PayoutsConnection(List<PayoutNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record MyPayoutsResponse(PayoutsConnection MyPayouts);

public record EarningsSummaryNode(
    decimal TotalEarnings,
    decimal PendingPayouts,
    decimal AvailableBalance,
    decimal ThisMonthEarnings,
    decimal LastMonthEarnings
);

public record GetEarningsSummaryResponse(EarningsSummaryNode EarningsSummary);

public record CreatePaymentIntentPayloadResponse(
    string ClientSecret,
    string PaymentIntentId,
    decimal Amount
);

public record CreatePaymentIntentResponse(CreatePaymentIntentPayloadResponse CreatePaymentIntent);

public record ConfirmPaymentPayloadResponse(PaymentNode Payment);

public record ConfirmPaymentResponse(ConfirmPaymentPayloadResponse ConfirmPayment);

public record RefundNode(
    Guid Id,
    string Status,
    decimal Amount,
    string Reason
);

public record RequestRefundPayloadResponse(RefundNode Refund);

public record RequestRefundResponse(RequestRefundPayloadResponse RequestRefund);

public record ProcessPayoutPayloadResponse(PayoutNode Payout);

public record ProcessPayoutResponse(ProcessPayoutPayloadResponse ProcessPayout);

public record ConnectStripeAccountPayloadResponse(string AccountId, string OnboardingUrl);

public record ConnectStripeAccountResponse(ConnectStripeAccountPayloadResponse ConnectStripeAccount);

public record RetryPayoutPayloadResponse(PayoutNode Payout);

public record RetryPayoutResponse(RetryPayoutPayloadResponse RetryPayout);

public record SpaceOwnerProfileNode(Guid Id, string? StripeAccountId, string? StripeAccountStatus);

public record RefreshStripeAccountPayloadResponse(SpaceOwnerProfileNode Profile);

public record RefreshStripeAccountStatusResponse(RefreshStripeAccountPayloadResponse RefreshStripeAccountStatus);

public record TransactionNode(
    Guid Id,
    string Type,
    decimal Amount,
    string? Description
);

public record TransactionsConnection(List<TransactionNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record TransactionsByBookingResponse(TransactionsConnection TransactionsByBooking);

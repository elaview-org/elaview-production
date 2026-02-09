namespace ElaviewBackend.Features.Payments;

[ExtendObjectType(typeof(SpendingSummary))]
public static class SpendingSummaryExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal GetTotalSpent([Parent] SpendingSummary summary) {
        return summary.TotalSpent;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetPendingPayments([Parent] SpendingSummary summary) {
        return summary.PendingPayments;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetThisMonthSpending([Parent] SpendingSummary summary) {
        return summary.ThisMonthSpending;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetLastMonthSpending([Parent] SpendingSummary summary) {
        return summary.LastMonthSpending;
    }
}

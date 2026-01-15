namespace ElaviewBackend.Features.Payments;

[ExtendObjectType(typeof(EarningsSummary))]
public static class EarningsSummaryExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal GetTotalEarnings([Parent] EarningsSummary summary) {
        return summary.TotalEarnings;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetPendingPayouts([Parent] EarningsSummary summary) {
        return summary.PendingPayouts;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal
        GetAvailableBalance([Parent] EarningsSummary summary) {
        return summary.AvailableBalance;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal
        GetThisMonthEarnings([Parent] EarningsSummary summary) {
        return summary.ThisMonthEarnings;
    }

    [GraphQLType(typeof(DecimalType))]
    public static decimal
        GetLastMonthEarnings([Parent] EarningsSummary summary) {
        return summary.LastMonthEarnings;
    }
}
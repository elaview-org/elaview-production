using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

[ExtendObjectType(typeof(EarningsSummary))]
public static class EarningsSummaryExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal GetTotalEarnings([Parent] EarningsSummary summary)
        => summary.TotalEarnings;

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetPendingPayouts([Parent] EarningsSummary summary)
        => summary.PendingPayouts;

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetAvailableBalance([Parent] EarningsSummary summary)
        => summary.AvailableBalance;

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetThisMonthEarnings([Parent] EarningsSummary summary)
        => summary.ThisMonthEarnings;

    [GraphQLType(typeof(DecimalType))]
    public static decimal GetLastMonthEarnings([Parent] EarningsSummary summary)
        => summary.LastMonthEarnings;
}

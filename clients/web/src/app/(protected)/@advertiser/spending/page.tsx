import api from "@/api/server";
import { graphql, type PaymentFilterInput } from "@/types/gql";
import { subDays } from "date-fns";
import SpendingCards from "./spending-cards";
import SpendingChart from "./spending-chart";
import PaymentsSection from "./payments-section";
import PaymentMethods from "./payment-methods";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";

function buildPaymentFilter(
  campaign?: string,
  dateFrom?: string,
  dateTo?: string
): PaymentFilterInput | undefined {
  const filters: PaymentFilterInput[] = [];

  if (campaign) {
    filters.push({ booking: { campaignId: { eq: campaign } } });
  }

  if (dateFrom && dateTo) {
    filters.push({
      createdAt: {
        gte: new Date(dateFrom).toISOString(),
        lte: new Date(dateTo).toISOString(),
      },
    });
  }

  if (filters.length === 0) return undefined;
  if (filters.length === 1) return filters[0];
  return { and: filters };
}

export default async function Page(props: PageProps<"/spending">) {
  const searchParams = await props.searchParams;
  const campaign = searchParams.campaign as string | undefined;
  const dateFrom = searchParams.dateFrom as string | undefined;
  const dateTo = searchParams.dateTo as string | undefined;

  const paymentWhere = buildPaymentFilter(campaign, dateFrom, dateTo);

  const defaultStart = subDays(new Date(), 90);
  const defaultEnd = new Date();

  const { summary, dailyStats, activeCampaigns, payments, paymentMethods } =
    await api
      .query({
        query: graphql(`
          query AdvertiserSpending(
            $startDate: DateTime!
            $endDate: DateTime!
            $paymentWhere: PaymentFilterInput
          ) {
            advertiserSpendingSummary {
              ...SpendingCards_SpendingSummaryFragment
            }
            advertiserDailyStats(startDate: $startDate, endDate: $endDate) {
              date
              spending
            }
            activeCampaigns: myCampaigns(
              where: { status: { in: [ACTIVE, SUBMITTED] } }
            ) {
              nodes {
                id
                name
              }
            }
            myPayments(
              first: 10
              where: $paymentWhere
              order: [{ createdAt: DESC }]
            ) {
              nodes {
                id
                ...PaymentsTable_PaymentFragment
              }
            }
            mySavedPaymentMethods {
              id
              brand
              last4
              expMonth
              expYear
              isDefault
            }
          }
        `),
        variables: {
          startDate: defaultStart.toISOString(),
          endDate: defaultEnd.toISOString(),
          paymentWhere,
        },
      })
      .then((res) => ({
        summary: res.data?.advertiserSpendingSummary,
        dailyStats: res.data?.advertiserDailyStats ?? [],
        activeCampaigns: res.data?.activeCampaigns,
        payments: res.data?.myPayments?.nodes ?? [],
        paymentMethods: res.data?.mySavedPaymentMethods ?? [],
      }));

  const chartData = dailyStats.map((stat) => ({
    date: new Date(stat.date).toISOString().split("T")[0],
    spending: Number(stat.spending),
  }));

  const campaigns = activeCampaigns?.nodes ?? [];
  const activeCampaignsCount = campaigns.length;

  return (
    <div className="flex flex-col gap-6">
      <MaybePlaceholder
        data={summary ? [summary] : []}
        placeholder={<Placeholder />}
      >
        <>
          {summary && (
            <SpendingCards
              data={summary}
              activeCampaignsCount={activeCampaignsCount}
            />
          )}
          <SpendingChart data={chartData} />
          <PaymentsSection
            payments={
              payments as unknown as Parameters<
                typeof PaymentsSection
              >[0]["payments"]
            }
            campaigns={campaigns}
          />
          <PaymentMethods paymentMethods={paymentMethods} />
        </>
      </MaybePlaceholder>
    </div>
  );
}

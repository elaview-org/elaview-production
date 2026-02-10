import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { formatCurrency } from "@/lib/utils";

export const Performance_CampaignFragment = graphql(`
  fragment Performance_CampaignFragment on Campaign {
    spacesCount
    totalSpend
    totalBudget
  }
`);

type Props = {
  data: FragmentType<typeof Performance_CampaignFragment>;
};

export default function Performance({ data }: Props) {
  const campaign = getFragmentData(Performance_CampaignFragment, data);
  const budget = Number(campaign.totalBudget ?? 0);
  const spent = Number(campaign.totalSpend);
  const remaining = Math.max(budget - spent, 0);
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground mb-3 text-sm">Performance</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold">{campaign.spacesCount}</p>
          <p className="text-muted-foreground text-xs">Spaces Booked</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{formatCurrency(spent)}</p>
          <p className="text-muted-foreground text-xs">Total Spend</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{formatCurrency(remaining)}</p>
          <p className="text-muted-foreground text-xs">Budget Remaining</p>
        </div>
      </div>
      {budget > 0 && (
        <div className="mt-4">
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-1 text-right text-xs">
            {progress.toFixed(0)}% of budget used
          </p>
        </div>
      )}
    </div>
  );
}

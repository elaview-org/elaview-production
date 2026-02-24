import api from "@/api/server";
import { graphql } from "@/types/gql";
import SpaceCalendar from "./calendar";

type Props = {
  spaceId: string;
};

export default async function CalendarWrapper({ spaceId }: Props) {
  const blockedDates = await api
    .query({
      query: graphql(`
        query SpaceBlockedDates($spaceId: ID!, $first: Int) {
          blockedDatesBySpace(spaceId: $spaceId, first: $first) {
            nodes {
              id
              date
            }
          }
        }
      `),
      variables: { spaceId, first: 50 },
    })
    .then((res) =>
      (res.data?.blockedDatesBySpace?.nodes ?? []).map((node) => ({
        date: String(node.date),
      }))
    );

  return <SpaceCalendar spaceId={spaceId} blockedDates={blockedDates} />;
}

import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";
import GridWrapper from "./grid-wrapper";
import { toSpaceMarker } from "../types";

export default async function Page() {
  const result = await api.query<Query>({
    query: api.gql`
      query {
        spaces(first: 32, where: { status: { eq: ACTIVE } }) {
          nodes {
            id
            title
            address
            city
            state
            zipCode
            latitude
            longitude
            pricePerDay
            type
            images
            width
            height
            status
          }
        }
      }
    `,
  });

  const spaces = result.data?.spaces?.nodes?.map(toSpaceMarker) ?? [];

  return <GridWrapper spaces={spaces} />;
}

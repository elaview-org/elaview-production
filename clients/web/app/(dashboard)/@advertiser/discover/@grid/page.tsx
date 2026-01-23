import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import GridWrapper from "./grid-wrapper";
import { toSpaceMarker } from "../types";

export default async function Page() {
  const { data } = await api.query({
    query: graphql(`
      query DiscoverSpaces {
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
    `),
  });

  const spaces = data?.spaces?.nodes?.map(toSpaceMarker) ?? [];

  return <GridWrapper spaces={spaces} />;
}

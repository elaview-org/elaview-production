import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import MapWrapper from "./map-wrapper";
import { toSpaceMarker } from "../types";

export default async function Page() {
  const { data } = await api.query({
    query: graphql(`
      query DiscoverSpacesMap {
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

  return <MapWrapper spaces={spaces} />;
}

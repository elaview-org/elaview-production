import gql from "./gql";
import { graphql, SortEnumType } from "@/types/gql";

const listings = {
  list: (variables: {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
    order?: Record<string, SortEnumType>[];
    where?: Record<string, unknown>;
    gridView: boolean;
    tableView: boolean;
    mapView: boolean;
  }) =>
    gql
      .query({
        query: graphql(`
          query SpaceOwnerListings(
            $first: Int
            $last: Int
            $after: String
            $before: String
            $order: [SpaceSortInput!]
            $where: SpaceFilterInput
            $gridView: Boolean!
            $tableView: Boolean!
            $mapView: Boolean!
          ) {
            mySpaces(
              first: $first
              last: $last
              after: $after
              before: $before
              order: $order
              where: $where
            ) {
              nodes {
                id
                ...SpaceCard_SpaceFragment @include(if: $gridView)
                ...ListingsTable_SpaceFragment @include(if: $tableView)
                ...ListingsMap_SpaceFragment @include(if: $mapView)
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `),
        variables,
      })
      .then((res) => ({
        spaces: res.data?.mySpaces?.nodes ?? [],
        pageInfo: res.data?.mySpaces?.pageInfo,
      })),

  detail: (id: string) =>
    gql
      .query({
        query: graphql(`
          query SpaceDetail($id: ID!) {
            spaceById(id: $id) {
              id
              averageRating
              ...Header_SpaceFragment
              ...Gallery_SpaceFragment
              ...Details_SpaceFragment
              ...Performance_SpaceFragment
            }
          }
        `),
        variables: { id },
      })
      .then((res) => res.data?.spaceById ?? null),

  bookings: (spaceId: string) =>
    gql
      .query({
        query: graphql(`
          query SpaceBookings($spaceId: UUID!, $first: Int) {
            myBookingsAsOwner(
              first: $first
              where: { spaceId: { eq: $spaceId } }
              order: [{ startDate: DESC }]
            ) {
              nodes {
                id
                status
                startDate
                endDate
                totalAmount
                campaign {
                  name
                  advertiserProfile {
                    companyName
                  }
                }
              }
            }
          }
        `),
        variables: { spaceId, first: 10 },
      })
      .then((res) => res.data?.myBookingsAsOwner?.nodes ?? []),

  reviews: (spaceId: string) =>
    gql
      .query({
        query: graphql(`
          query SpaceReviews($spaceId: ID!, $first: Int) {
            reviewsBySpace(
              spaceId: $spaceId
              first: $first
              order: [{ createdAt: DESC }]
            ) {
              nodes {
                id
                rating
                comment
                createdAt
                reviewer {
                  name
                  avatar
                }
              }
            }
          }
        `),
        variables: { spaceId, first: 10 },
      })
      .then((res) => res.data?.reviewsBySpace?.nodes ?? []),

  blockedDates: (spaceId: string) =>
    gql
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
      ),
};
export default listings;

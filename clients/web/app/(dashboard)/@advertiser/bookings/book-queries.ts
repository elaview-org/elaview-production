import api from "@/api/gql/server";
import { Booking, graphql } from "@/types/gql";

const BOOKINGS_LIMIT = 10;

export default async function getBookingsQuery(): Promise<{bookings: Booking[]}> {
  try {
    const { data } = await api.query({
      query: graphql(`
        query GetMyBookingsAsAdvertiser($first: Int!) {
          myBookingsAsAdvertiser(first: $first) {
            nodes {
              id
              status
              startDate
              endDate
              createdAt
              space {
                title
                city
                state
              }
              campaign {
                name
              }
            }
          }
        }
      `),
      variables: { first: BOOKINGS_LIMIT },
    });

    const bookings = data?.myBookingsAsAdvertiser?.nodes || [];
    return { bookings: bookings as Booking[] };
  } catch {
    return { bookings: [] };
  }
}

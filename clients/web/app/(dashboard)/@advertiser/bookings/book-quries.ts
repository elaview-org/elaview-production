import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";

const BOOKINGS_LIMIT = 10;

const BOOKINGS_QUERY = api.gql`
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
`;

export default async function getBookingsQuery() {
  try {
    const { data } = await api.query<Query>({
      query: BOOKINGS_QUERY,
      variables: { first: BOOKINGS_LIMIT },
    });

    const bookings = data?.myBookingsAsAdvertiser?.nodes || [];
    return { bookings };
  } catch {
    // Optionally log or handle the error here
    return { bookings: [] };
  }
}

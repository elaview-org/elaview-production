import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";

export default async function getAdvertiserQuery() {
  const { data } = await api.query<Query>({
    query: api.gql`
      query {
        me {
          id
          email
          name
          avatar
          phone
          createdAt
          lastLoginAt
          activeProfileType
          advertiserProfile {
            id
            companyName
            industry
            website
            onboardingComplete
          }
        }
      }
    `,
  });
  return {
    status: !data?.me,
    user: data?.me,
  };
}

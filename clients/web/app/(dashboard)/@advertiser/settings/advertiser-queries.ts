import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";

export default async function getAdvertiserQuery() {
  const { data } = await api.query<Query>({
    query: api.gql`
      query GetCurrentUserForSettings {
        currentUser {
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
    status:!data?.currentUser,
    currentUser: data?.currentUser
  };
}

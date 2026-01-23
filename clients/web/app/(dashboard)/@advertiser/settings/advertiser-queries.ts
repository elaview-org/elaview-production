import api from "@/api/gql/server";
import { graphql } from "@/types/gql";

export default async function getAdvertiserQuery() {
  const { data } = await api.query({
    query: graphql(`
      query AdvertiserSettings {
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
    `),
  });
  return {
    status: !data?.me,
    user: data?.me,
  };
}

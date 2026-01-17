import api from "@/api/gql/server";

export default async function getBooksQuries(): Promise<{ name: string }> {
const { data } = await api.query({
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
  console.log('data',data);
  return {
    name: "",
  };
}

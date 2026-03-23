import { gql } from "@apollo/client";
import api from "@/api/server";
import RegisterScreenForm from "./register-screen-form";

const MY_SPACES_QUERY = gql`
  query MySpacesForScreenRegistration {
    mySpaces(first: 50) {
      nodes {
        id
        title
      }
    }
  }
`;

type MySpacesData = {
  mySpaces: { nodes: Array<{ id: string; title: string }> } | null;
};

export default async function RegisterScreenPage() {
  const { data } = await api.query<MySpacesData>({
    query: MY_SPACES_QUERY,
    revalidate: 60,
    tags: ["my-spaces"],
  });

  const spaces = (data?.mySpaces?.nodes ?? []).map((s) => ({
    id: s.id,
    title: s.title,
  }));

  return <RegisterScreenForm spaces={spaces} />;
}

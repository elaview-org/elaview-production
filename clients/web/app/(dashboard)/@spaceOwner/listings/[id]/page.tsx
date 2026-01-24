import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import Details from "./details";
import Gallery from "./gallery";
import Header from "./header";
import Performance from "./performance";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await api.query({
    query: graphql(`
      query SpaceDetail($id: ID!) {
        spaceById(id: $id) {
          id
          ...Header_SpaceFragment
          ...Gallery_SpaceFragment
          ...Details_SpaceFragment
          ...Performance_SpaceFragment
        }
      }
    `),
    variables: { id },
  });

  if (error || !data?.spaceById) {
    notFound();
  }

  const space = data.spaceById;

  return (
    <div className="flex flex-col gap-6">
      <Header data={space} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Gallery data={space} />
        <Performance data={space} />
      </div>
      <Details data={space} />
    </div>
  );
}
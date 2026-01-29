import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { z } from "zod";
import Details from "./details";
import Gallery from "./gallery";
import Header from "./header";
import Performance from "./performance";

export default async function Page({ params }: PageProps<"/listings/[id]">) {
  const space = await api
    .query({
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
      variables: {
        id: await params.then(({ id }) => {
          if (z.uuid().safeParse(id).error) {
            notFound();
          }
          return id;
        }),
      },
    })
    .then((res) => res.data?.spaceById ?? notFound())
    .catch(() => notFound());

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

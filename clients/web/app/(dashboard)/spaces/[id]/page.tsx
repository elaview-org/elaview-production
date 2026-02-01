import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { z } from "zod";
import Gallery from "./gallery";
import Header from "./header";
import OwnerCard from "./owner-card";
import PricingCard from "./pricing-card";
import SpaceInfo from "./space-info";

export default async function Page({ params }: PageProps<"/spaces/[id]">) {
  const space = await api
    .query({
      query: graphql(`
        query SharedSpaceDetail($id: ID!) {
          spaceById(id: $id) {
            id
            ...Header_SharedSpaceFragment
            ...Gallery_SharedSpaceFragment
            ...SpaceInfo_SpaceFragment
            ...PricingCard_SpaceFragment
            ...OwnerCard_SpaceFragment
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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Gallery data={space} />
          <SpaceInfo data={space} />
        </div>
        <div className="flex flex-col gap-6">
          <PricingCard data={space} />
          <OwnerCard data={space} />
        </div>
      </div>
    </div>
  );
}

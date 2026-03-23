import api from "@/api/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/primitives/button";
import Gallery from "@/app/(protected)/@content/@shared/_spaces/[id]/gallery";
import Header from "@/app/(protected)/@content/@shared/_spaces/[id]/header";
import OwnerCard from "@/app/(protected)/@content/@shared/_spaces/[id]/owner-card";
import PricingCard from "@/app/(protected)/@content/@shared/_spaces/[id]/pricing-card";
import SpaceInfo from "@/app/(protected)/@content/@shared/_spaces/[id]/space-info";
import { IconCalendar } from "@tabler/icons-react";

export default async function SpaceDetailsPage({
  params,
}: PageProps<"/spaces/[id]">) {
  const id = await params.then((p) => {
    if (z.string().uuid().safeParse(p.id).error) {
      notFound();
    }
    return p.id;
  });

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
      variables: { id },
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
          <div id="book">
            <PricingCard data={space} />
          </div>
          <Button asChild className="w-full" size="lg">
            <a href="#book">
              <IconCalendar className="size-4" />
              Book Now
            </a>
          </Button>
          <OwnerCard data={space} />
        </div>
      </div>
    </div>
  );
}

import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import Header from "./header";
import Gallery from "./gallery";
import Performance from "./performance";
import Details from "./details";
import Bookings, { BookingsSkeleton } from "./bookings";
import ActionsBar from "./actions-bar";

export default async function Page({ params }: PageProps<"/campaigns/[id]">) {
  const campaign = await api
    .query({
      query: graphql(`
        query CampaignDetail($id: ID!) {
          campaignById(id: $id) {
            id
            ...Header_CampaignFragment
            ...Gallery_CampaignFragment
            ...Details_CampaignFragment
            ...Performance_CampaignFragment
            ...ActionsBar_CampaignFragment
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
    .then((res) => res.data?.campaignById ?? notFound())
    .catch(() => notFound());

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Header data={campaign} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Gallery data={campaign} />
        <Performance data={campaign} />
      </div>
      <Details data={campaign} />
      <Suspense fallback={<BookingsSkeleton />}>
        <Bookings campaignId={campaign.id} />
      </Suspense>
      <ActionsBar data={campaign} />
    </div>
  );
}

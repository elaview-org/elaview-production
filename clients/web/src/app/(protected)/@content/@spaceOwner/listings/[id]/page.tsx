import api from "@/api/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import Details from "./details";
import Gallery from "./gallery";
import Header from "./header";
import Performance from "./performance";
import Bookings, { BookingsSkeleton } from "./bookings";
import Reviews, { ReviewsSkeleton } from "./reviews";
import CalendarWrapper from "./calendar-wrapper";
import { CalendarSkeleton } from "./calendar";

export default async function Page({ params }: PageProps<"/listings/[id]">) {
  const space = await api
    .query({
      query: graphql(`
        query SpaceDetail($id: ID!) {
          spaceById(id: $id) {
            id
            averageRating
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
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<BookingsSkeleton />}>
          <Bookings spaceId={space.id} />
        </Suspense>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews spaceId={space.id} averageRating={space.averageRating} />
        </Suspense>
      </div>
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarWrapper spaceId={space.id} />
      </Suspense>
    </div>
  );
}

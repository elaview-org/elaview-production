import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import { SPACE_TYPE } from "@/lib/core/constants";
import { formatCurrency } from "@/lib/core/utils";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  IconMapPin,
  IconStar,
  IconCalendar,
  IconRuler,
  IconCurrencyDollar,
  IconArrowLeft,
  IconLock,
} from "@tabler/icons-react";

export default async function Page({ params }: PageProps<"/spaces/[id]">) {
  const { id } = await params;

  if (z.uuid().safeParse(id).error) notFound();

  const space = await api
    .query({
      query: graphql(`
        query PublicSpaceDetail($id: ID!) {
          spaceById(id: $id) {
            id
            title
            description
            images
            type
            status
            city
            state
            address
            zipCode
            pricePerDay
            installationFee
            minDuration
            maxDuration
            dimensions
            dimensionsText
            width
            height
            traffic
            averageRating
            totalBookings
            spaceOwnerProfile {
              businessName
              user {
                name
                avatar
              }
            }
          }
        }
      `),
      variables: { id },
    })
    .then((res) => res.data?.spaceById ?? null)
    .catch((err) => {
      // Re-throw Next.js framework errors (redirect, notFound) so they aren't swallowed
      if (err?.digest) throw err;
      return null;
    });

  if (!space || space.status !== "ACTIVE") notFound();

  const images = space.images as string[];
  const locationParts = [
    space.address,
    space.city,
    space.state,
    space.zipCode,
  ].filter(Boolean);
  const ownerName =
    space.spaceOwnerProfile?.businessName ??
    space.spaceOwnerProfile?.user?.name ??
    "Space Owner";

  return (
    <div className="flex flex-col gap-10 py-10 md:py-16">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/spaces">
            <IconArrowLeft className="mr-1 size-4" />
            Back to spaces
          </Link>
        </Button>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {images.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`relative aspect-video overflow-hidden rounded-lg ${i === 0 && images.length > 1 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-64" : ""}`}
            >
              <Image
                src={src}
                alt={`${space.title} photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main info */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Title & type */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{SPACE_TYPE.labels[space.type]}</Badge>
              {space.averageRating !== null && (
                <span className="flex items-center gap-1 text-sm">
                  <IconStar className="size-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-medium">
                    {(space.averageRating as number).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    · {space.totalBookings} booking
                    {space.totalBookings !== 1 ? "s" : ""}
                  </span>
                </span>
              )}
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {space.title}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <IconMapPin className="size-4 shrink-0" />
              {locationParts.join(", ")}
            </p>
          </div>

          <Separator />

          {/* Description */}
          {space.description && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">About this space</h2>
              <p className="text-muted-foreground leading-relaxed">
                {space.description}
              </p>
            </div>
          )}

          {/* Details */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Space details</h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {space.dimensionsText && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                    <IconRuler className="size-3" /> Dimensions
                  </dt>
                  <dd className="text-sm font-medium">
                    {space.dimensionsText}
                  </dd>
                </div>
              )}
              {space.minDuration && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                    <IconCalendar className="size-3" /> Min duration
                  </dt>
                  <dd className="text-sm font-medium">
                    {space.minDuration} day{space.minDuration !== 1 ? "s" : ""}
                  </dd>
                </div>
              )}
              {space.maxDuration && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                    <IconCalendar className="size-3" /> Max duration
                  </dt>
                  <dd className="text-sm font-medium">
                    {space.maxDuration} day{space.maxDuration !== 1 ? "s" : ""}
                  </dd>
                </div>
              )}
              {space.traffic && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                    Traffic
                  </dt>
                  <dd className="text-sm font-medium">{space.traffic}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Owner */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">Listed by</h2>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{ownerName}</p>
                <p className="text-muted-foreground text-sm">
                  Verified space owner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-xl border p-6 shadow-sm">
            {/* Pricing */}
            <div className="mb-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {formatCurrency(space.pricePerDay as number)}
              </span>
              <span className="text-muted-foreground text-sm">/day</span>
            </div>

            {space.installationFee !== null && (
              <p className="text-muted-foreground mb-4 flex items-center gap-1 text-sm">
                <IconCurrencyDollar className="size-3.5" />
                Installation fee:{" "}
                {formatCurrency(space.installationFee as number)}
              </p>
            )}

            <Separator className="mb-4" />

            {/* Lock CTA */}
            <div className="flex flex-col gap-3">
              <Button className="w-full" asChild>
                <Link href={`/login?next=/spaces/${space.id}`}>
                  Book this space
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Create free account</Link>
              </Button>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <IconLock className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
              <p className="text-muted-foreground text-xs leading-relaxed">
                Sign in or create a free account to book this space. Payment is
                held in escrow until your ad is installed and verified.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

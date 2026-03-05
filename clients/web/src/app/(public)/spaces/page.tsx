import Link from "next/link";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import { parseSpaceListParams } from "@/lib/space-list-params";
import { GridView } from "@/components/composed/grid-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import { Button } from "@/components/primitives/button";
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import SpaceCard from "./space-card";

const PAGE_SIZE = 32;

export default async function Page(props: PageProps<"/spaces">) {
  const searchParams = await props.searchParams;
  const { params, filterEntries } = parseSpaceListParams(
    searchParams,
    undefined,
    ["price"]
  );

  const searchFilter = params.q
    ? {
        or: [
          { title: { contains: params.q } },
          { city: { contains: params.q } },
        ],
      }
    : {};

  const filters = [
    { status: { eq: "ACTIVE" } },
    ...(Object.keys(filterEntries).length > 0 ? [filterEntries] : []),
    ...(Object.keys(searchFilter).length > 0 ? [searchFilter] : []),
  ];

  const { spaces, pageInfo } = await api
    .query({
      query: graphql(`
        query PublicBrowseSpaces(
          $first: Int
          $last: Int
          $after: String
          $before: String
          $where: SpaceFilterInput
          $order: [SpaceSortInput!]
        ) {
          spaces(
            first: $first
            last: $last
            after: $after
            before: $before
            where: $where
            order: $order
          ) {
            nodes {
              id
              ...PublicSpacesSpaceCard_SpaceFragment
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      `),
      variables: {
        first:
          params.last || params.before
            ? undefined
            : (params.first ?? PAGE_SIZE),
        last: params.last,
        after: params.after,
        before: params.before,
        where: filters.length > 1 ? { and: filters } : filters[0],
        order: params.sort
          ? params.sort.split(",").map((entry) => {
              const [key, dir] = entry.split(":");
              return { [key]: dir === "DESC" ? "DESC" : "ASC" };
            })
          : [{ createdAt: "DESC" }],
      },
    })
    .then((res) => ({
      spaces: res.data?.spaces?.nodes ?? [],
      pageInfo: res.data?.spaces?.pageInfo,
      totalCount: res.data?.spaces?.totalCount ?? 0,
    }));

  const searchQuery = params.q ?? "";

  return (
    <div className="flex flex-col gap-8 py-10 md:py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Spaces</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Find the perfect physical advertising space for your next campaign.
          </p>
        </div>
        <Button asChild>
          <Link href="/signup">List your space</Link>
        </Button>
      </div>

      {/* Search */}
      <form method="GET" className="flex max-w-xl gap-2">
        <div className="relative flex-1">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            name="q"
            type="text"
            defaultValue={searchQuery}
            placeholder="Search by name or city..."
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border py-1 pr-3 pl-9 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      {/* Grid */}
      <MaybePlaceholder
        data={spaces}
        placeholder={
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? `No spaces found for "${searchQuery}".`
                : "No spaces available right now. Check back soon."}
            </p>
            {searchQuery && (
              <Button variant="ghost" asChild>
                <Link href="/spaces">Clear search</Link>
              </Button>
            )}
          </div>
        }
      >
        <GridView columns={4}>
          {spaces.map((space, i) => (
            <SpaceCard key={i} data={space} />
          ))}
        </GridView>
      </MaybePlaceholder>

      {/* Pagination */}
      {(pageInfo?.hasNextPage || pageInfo?.hasPreviousPage) && (
        <div className="flex items-center justify-center gap-2">
          {pageInfo.hasPreviousPage && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={{
                  pathname: "/spaces",
                  query: {
                    ...(searchQuery ? { q: searchQuery } : {}),
                    before: pageInfo.startCursor,
                    last: PAGE_SIZE,
                  },
                }}
              >
                <IconChevronLeft className="size-4" />
                Previous
              </Link>
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={{
                  pathname: "/spaces",
                  query: {
                    ...(searchQuery ? { q: searchQuery } : {}),
                    after: pageInfo.endCursor,
                    first: PAGE_SIZE,
                  },
                }}
              >
                Next
                <IconChevronRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Sign-up CTA */}
      <div className="bg-muted mt-8 rounded-xl p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Ready to advertise?</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Create a free account to book spaces, manage campaigns, and track
          performance.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/signup">Get started for free</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/how-it-works">Learn how it works</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

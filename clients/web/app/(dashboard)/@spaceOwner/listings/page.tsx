import api from "@/api/gql/server";
import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { graphql } from "@/types/gql";
import { IconBuildingStore, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageNav from "./page-nav";
import Toolbar from "./toolbar";
import SpaceCard from "./space-card";

export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query SpaceOwnerListings {
        mySpaces {
          nodes {
            id
            ...SpaceCard_SpaceFragment
          }
        }
      }
    `),
  });

  if (error) {
    redirect("/logout");
  }

  const spaces = data?.mySpaces?.nodes ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Toolbar />
      {spaces.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBuildingStore />
            </EmptyMedia>
            <EmptyTitle>No spaces yet</EmptyTitle>
            <EmptyDescription>
              Create your first listing to start earning
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/listings/new">
                <IconPlus />
                Create Listing
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-6 @md/main:grid-cols-2 @3xl/main:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id as string} data={space} />
          ))}
        </div>
      )}
      <PageNav />
    </div>
  );
}

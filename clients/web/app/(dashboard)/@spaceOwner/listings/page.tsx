import api from "@/api/gql/server";

import Toolbar from "@/components/composed/toolbar";
import { graphql } from "@/types/gql";

import { redirect } from "next/navigation";
import SpaceCard from "./space-card";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";

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
      <Toolbar {...TOOLBAR_PROPS} action={<CreateSpace />} />
      <MaybePlaceholder data={spaces} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-6 @md/main:grid-cols-2 @3xl/main:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id as string} data={space} />
          ))}
        </div>
      </MaybePlaceholder>
    </div>
  );
}

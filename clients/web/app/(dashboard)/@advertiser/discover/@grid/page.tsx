import SpaceCard from "./space-card";
import Modal from "@/components/modal";
import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";
import { Suspense } from "react";

export default async function Page() {
  const s = await api.query<Query>({
    query: api.gql`
      query {
        spaces (first: 50) {
          nodes {
            address
            city
            state
            zipCode
          }
        }
      }
    `,
  });

  return (
    <div className="2xl: grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {s.data?.spaces?.nodes
        ?.map((data) => ({
          id: data.id as string,
          title: data.title,
          address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
          size: `${data.width}x${data.height} sq ft`,
          dailyRate: data.pricePerDay as string,
          status: "Available",
          images: data.images,
        }))
        .map((space) => (
          <Suspense key={space.id} fallback={null}>
            <Modal trigger={<SpaceCard {...space} />}>
              <></>
            </Modal>
          </Suspense>
        ))}
    </div>
  );
}

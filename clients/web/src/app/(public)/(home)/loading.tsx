import { Skeleton } from "@/components/primitives/skeleton";
import { FeaturedSpacesSkeleton } from "./featured-spaces";

export default function Loading() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="pt-12 md:pt-18">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-14 w-full max-w-lg" />
            <Skeleton className="h-6 w-full max-w-md" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
          <Skeleton className="aspect-video rounded-lg" />
        </div>
      </section>
      <FeaturedSpacesSkeleton />
    </div>
  );
}

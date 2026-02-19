import { MediaCardSkeleton } from "@/components/composed/media-card";

export default function Loading() {
  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-9 w-48 rounded" />
          <div className="bg-muted h-5 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

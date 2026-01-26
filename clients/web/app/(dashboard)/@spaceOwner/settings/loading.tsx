import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-5" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
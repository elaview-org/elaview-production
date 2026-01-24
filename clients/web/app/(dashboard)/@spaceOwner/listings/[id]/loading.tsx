import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <Skeleton className="h-8 w-64" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border p-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
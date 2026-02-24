import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-9" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="rounded-xl border py-6">
            <div className="flex flex-col gap-6 px-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="bg-border my-6 h-px w-full" />
            <div className="flex flex-col gap-6 px-6">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="bg-border my-6 h-px w-full" />
            <div className="flex flex-col gap-6 px-6">
              <Skeleton className="h-5 w-16" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border py-6">
            <div className="flex flex-col gap-4 px-6">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-32" />
              <div className="bg-border my-2 h-px w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="px-6 pt-6">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          <div className="rounded-xl border py-6">
            <div className="flex flex-col gap-4 px-6">
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

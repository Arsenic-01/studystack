import { Skeleton } from "@/components/ui/skeleton";

export default function ManageSubjectsLoading() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full py-28 lg:py-32 2xl:py-36 min-h-screen">
      <div className="w-full max-w-5xl mx-auto px-5 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-5 w-80 rounded-md mt-2" />
          </div>
          <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full md:w-52 rounded-md" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

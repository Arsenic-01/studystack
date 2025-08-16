import { Skeleton } from "@/components/ui/skeleton";

// This is now a "dumb" Server Component with no client-side hooks.
const AdminSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-72 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>

      {/* Filters and Buttons Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-0 pb-4">
        <Skeleton className="h-10 w-full md:w-1/3 rounded-md" />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-fit">
          <Skeleton className="h-10 w-full md:w-44 rounded-md" />
          <Skeleton className="h-10 w-full md:w-44 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Skeleton className="w-full h-[400px] rounded-md" />

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );
};

export default AdminSkeleton;

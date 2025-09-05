import { Skeleton } from "@/components/ui/skeleton";

const GoogleFormCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border border-neutral-300 dark:border-neutral-800 rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 hidden sm:block" />
        <Skeleton className="h-9 w-9 hidden sm:block" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default GoogleFormCardSkeleton;

// app/dashboard/loading.tsx
import NoteCardSkeleton from "@/components/notes_page_components/skeleton/NoteCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const NOTES_PER_PAGE = 6;

export default function DashboardLoading() {
  return (
    <div className="container mx-auto min-h-screen py-24 sm:py-32 max-w-5xl px-5 xl:px-0">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8 gap-0 md:gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-36 mt-4 md:mt-0" />
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full">
        <div className="h-auto w-full md:w-fit md:h-10 flex flex-col md:flex-row p-1 bg-muted rounded-lg">
          <Skeleton className="h-8 w-full md:w-28 mb-1 md:mb-0 md:mr-1" />
          <Skeleton className="h-8 w-full md:w-28 mb-1 md:mb-0 md:mr-1" />
          <Skeleton className="h-8 w-full md:w-28" />
        </div>

        {/* Default Tab Content Skeleton (Notes) */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: NOTES_PER_PAGE }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

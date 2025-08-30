import SubjectCardSkeleton from "@/components/semester_page_components/skeleton/SubjectCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SemesterLoading() {
  return (
    // Replicate the main page layout from your page.tsx
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
      <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 md:px-8">
        {/* 1. Skeleton for the Header (Breadcrumb + Search Bar) */}
        <div className="w-full flex flex-col gap-7 md:flex-row md:justify-between md:items-center">
          <Skeleton className="h-9 w-48" /> {/* Breadcrumb Skeleton */}
          <Skeleton className="h-10 md:w-1/3" /> {/* Search Input Skeleton */}
        </div>

        {/* 2. Skeleton for the list of Subjects */}
        <div className="mt-4 w-full">
          {/* Map over a placeholder array to show multiple loading cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <SubjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

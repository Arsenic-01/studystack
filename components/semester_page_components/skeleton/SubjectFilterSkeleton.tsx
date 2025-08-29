// components/semester_page_components/SubjectFilterSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import SubjectCardSkeleton from "./SubjectCardSkeleton";

const SubjectFilterSkeleton = () => {
  return (
    <div className="w-full">
      {/* Top section: Breadcrumb and Search bar skeletons */}
      <div className="w-full flex flex-col gap-7 md:flex-row md:justify-between md:items-center">
        {/* Skeleton for BreadcrumbWithDropdown */}
        <Skeleton className="h-6 w-48 rounded-md" />

        {/* Skeleton for Search Input */}
        <div className="relative md:w-1/3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Bottom section: List of subject card skeletons */}
      <div className="mt-4">
        {/* Render a few SubjectCardSkeleton components to simulate loading */}
        <SubjectCardSkeleton />
        <SubjectCardSkeleton />
        <SubjectCardSkeleton />
      </div>
    </div>
  );
};

export default SubjectFilterSkeleton;

import { Skeleton } from "@/components/ui/skeleton";
import SubjectCardSkeleton from "./_components/_skeleton/SubjectCardSkeleton";

export default function SemesterLoading() {
  return (
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24">
      <div className="flex flex-col items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 xl:px-0">
        <div className="w-full flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <Skeleton className="h-9 w-[270px]" />
          <Skeleton className="h-9 md:w-1/3" />
        </div>

        <div className="w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <SubjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

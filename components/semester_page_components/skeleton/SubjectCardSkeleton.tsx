import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

const SubjectCardSkeleton = () => {
  const { user } = useAuthStore();

  const authorized = user?.role === "admin" || user?.role === "teacher";

  return (
    <div className="flex flex-col items-start overflow-x-clip rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 my-5 gap-3 justify-center w-full py-5 md:py-10 px-4 md:px-10">
      <div>
        <div className="flex items-center gap-2 overflow-x-clip">
          <Skeleton className="h-7 md:h-8 w-32" />
          <Skeleton className="h-7 md:h-8 w-40 md:w-52" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="flex flex-col sm:inline-flex gap-3 justify-end pt-5 w-full">
        {!authorized && (
          <div className="flex flex-col md:flex-row justify-end w-full gap-2">
            <Skeleton className="h-9 w-full sm:w-36 rounded-full" />
          </div>
        )}
        {authorized && (
          <div className="flex flex-col md:flex-row justify-end w-full gap-2">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="size-9 rounded-full w-full sm:w-9" />
              <Skeleton className="size-9 rounded-full w-full sm:w-9" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Skeleton className="h-9 w-full sm:w-36 rounded-full" />
              <Skeleton className="h-9 w-full sm:w-36 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCardSkeleton;

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

const SubjectCardSkeleton = () => {
  const { user } = useAuthStore();

  const authorized = user?.role === "admin" || user?.role === "teacher";

  return (
    <div className="flex flex-col items-start overflow-x-clip rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 my-5 gap-3 justify-center w-full py-5 md:py-10 px-4 md:px-10">
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
            <Skeleton className="size-9 rounded-full" />
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

// This component is a skeleton loader for the SubjectCard component. It displays a loading state with skeletons for the subject name, course code, and buttons. The skeletons are styled to match the layout of the actual SubjectCard component, providing a smooth user experience while the data is being fetched.
// The component uses the Skeleton component from the UI library to create the loading effect. The authorized variable checks if the user has the role of admin or teacher, and conditionally renders the upload button skeletons based on that. The overall layout and styling are consistent with the SubjectCard component to maintain a cohesive design.

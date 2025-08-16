import { Skeleton } from "@/components/ui/skeleton";

const AdminSkeleton = () => {
  return (
    <div className="flex flex-col gap-10">
      {" "}
      {/* Increased gap for better section separation */}
      {/* --- Header Skeleton --- */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      {/* --- Stat Cards Skeleton (Updated to 6 cards) --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      {/* --- Users Table Section Skeleton --- */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Skeleton className="h-10 w-full md:max-w-sm rounded-md" />
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-fit">
            <Skeleton className="h-10 w-full sm:w-44 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-44 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </div>
      {/* --- Main Analytics Charts Skeleton --- */}
      <div className="space-y-6">
        <Skeleton className="h-[450px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[450px] w-full rounded-lg" />
          <Skeleton className="h-[450px] w-full rounded-lg" />
        </div>
      </div>
      {/* --- Notes Table Section Skeleton --- */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-56 mb-2 rounded-md" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full md:w-auto md:flex-grow rounded-md" />
          <Skeleton className="h-10 w-full md:w-48 rounded-md" />
        </div>
        <Skeleton className="w-full h-[360px] rounded-lg" />
      </div>
      {/* --- YouTube Table Section Skeleton --- */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2 rounded-md" />
        <Skeleton className="h-10 w-full md:max-w-sm rounded-md" />
        <Skeleton className="w-full h-[360px] rounded-lg" />
      </div>
      {/* --- Forms & Links Table Section Skeleton --- */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-72 mb-2 rounded-md" />
        <div className="flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 flex-grow rounded-md" />
          <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
        </div>
        <Skeleton className="w-full h-[360px] rounded-lg" />
      </div>
    </div>
  );
};

export default AdminSkeleton;

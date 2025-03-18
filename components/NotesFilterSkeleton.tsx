import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import NoteCardSkeleton from "./NoteCardSkeleton";
import Link from "next/link";

const NotesFilterSkeleton = () => {
  return (
    <div className="container mx-auto py-28 sm:py-32 2xl:py-36 max-w-5xl px-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-8">
        <Button variant="outline" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft /> Back
          </Link>
        </Button>
        <Skeleton className="h-8 w-80" />
      </div>

      {/* Filters section */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full">
          <div className="flex sm:flex-row items-center gap-2 md:gap-3 w-full">
            <Skeleton className="h-10 w-full md:w-[180px]" />
            <Skeleton className="h-10 w-full md:w-[180px]" />
          </div>
          <Skeleton className="h-10 w-full md:w-[280px]" />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <NoteCardSkeleton key={index} />
            ))}
        </div>

        {/* Notes Count */}
        <div>
          <Skeleton className="h-5 w-48 mt-4" />
        </div>
      </div>

      {/* YouTube Videos Section */}
      <div className="mt-10">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="flex gap-2 items-center justify-between">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg mt-2" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NotesFilterSkeleton;

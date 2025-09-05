import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import NoteCardSkeleton from "./NoteCardSkeleton";
import YouTubeCardSkeleton from "./YouTubeCardSkeleton"; // Import new component
import GoogleFormCardSkeleton from "./GoogleFormCardSkeleton"; // Import new component

const NotesFilterSkeleton = () => {
  return (
    <div className="container mx-auto py-28 sm:py-32 max-w-5xl px-5 xl:px-0">
      {/* Header */}
      <div className="flex gap-4 sm:gap-10 mb-4">
        <Button variant="outline" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft /> Back
          </Link>
        </Button>
        <Skeleton className="h-8 w-80" />
      </div>

      {/* Notes Section */}
      <div className="flex flex-col gap-5">
        {/* Filters */}
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

      {/* --- REVISED: YouTube Videos Section Skeleton --- */}
      <div className="mt-10">
        <Skeleton className="h-8 w-48 mb-6" /> {/* Match new heading margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <YouTubeCardSkeleton key={index} />
            ))}
        </div>
      </div>

      {/* --- NEW: Quizzes & Links Section Skeleton --- */}
      <div className="mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <GoogleFormCardSkeleton key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default NotesFilterSkeleton;
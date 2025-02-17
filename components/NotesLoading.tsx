import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export function LoadingNoteCard() {
  // Format the createdAt date using Intl.DateTimeFormat

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" relative mb-4">
            {/* Use the previewUrl as the image source */}
            <Skeleton className="w-full h-56" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            <Skeleton className="h-7 w-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" relative mb-4">
            {/* Use the previewUrl as the image source */}
            <Skeleton className="w-full h-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            <Skeleton className="h-7 w-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" relative mb-4">
            {/* Use the previewUrl as the image source */}
            <Skeleton className="w-full h-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NoteCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full">
      {/* Card Header */}
      <CardHeader className="flex-row justify-between items-end">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow">
        <Skeleton className="w-full aspect-video rounded-md mb-4" />
        <div className="flex gap-1 justify-center items-center">
          <Skeleton className="h-7 w-full mb-2" />
          <Skeleton className="h-7 w-full mb-2" />
        </div>
        <Skeleton className="h-5 w-3/4" />
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default NoteCardSkeleton;

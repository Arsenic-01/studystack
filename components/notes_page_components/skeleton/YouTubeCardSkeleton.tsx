import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const YouTubeCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <Skeleton className="aspect-video w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2 mt-3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};

export default YouTubeCardSkeleton;

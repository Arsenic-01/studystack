// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";

// const NoteCardSkeleton = () => {
//   return (
//     <Card className="flex flex-col h-full">
//       {/* Card Header */}
//       <CardHeader className="flex-row justify-between items-center">
//         <Skeleton className="h-6 w-2/3 rounded-md" />
//         <Skeleton className="h-8 w-8 rounded-md" />
//       </CardHeader>

//       {/* Card Content */}
//       <CardContent className="flex-grow">
//         <Skeleton className="w-full aspect-video rounded-md mb-4" />
//         <Skeleton className="h-4 w-5/6 mb-2 rounded-md" />
//         <Skeleton className="h-4 w-3/4 rounded-md" />
//       </CardContent>

//       {/* Card Footer */}
//       <CardFooter>
//         <Button className="w-full" disabled>
//           <Skeleton className="h-10 w-full rounded-md" />
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default NoteCardSkeleton;

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NoteCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full  border border-neutral-200 dark:border-neutral-900">
      {/* Card Header */}
      <CardHeader className="flex-row justify-between items-end">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow">
        <Skeleton className="w-full aspect-video rounded-md mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default NoteCardSkeleton;

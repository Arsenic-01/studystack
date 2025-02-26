import { deleteYoutubeLink } from "@/lib/actions/Youtube.actions";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

import { useQueryClient } from "@tanstack/react-query"; // ✅ Import useQueryClient

const DeleteYoutubeLink = ({ id }: { id: string }) => {
  const queryClient = useQueryClient(); // ✅ Initialize queryClient

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mt-2 w-full">
          <Trash />
          Delete Video
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the YouTube
          embed.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await deleteYoutubeLink(id);
                toast.success("YouTube link deleted successfully");

                // ✅ Invalidate cache to refetch updated data
                queryClient.invalidateQueries({ queryKey: ["youtubeLinks"] });

                // router.refresh(); // Ensure UI updates
              } catch (error) {
                toast.error("Failed to delete the video.");
                console.error(error);
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteYoutubeLink;

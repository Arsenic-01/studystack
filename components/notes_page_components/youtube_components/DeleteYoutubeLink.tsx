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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

const DeleteYoutubeLink = ({
  id,
  semester,
  abbreviation,
}: {
  id: string;
  semester: string;
  abbreviation: string;
}) => {
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
                await deleteYoutubeLink({ id, semester, abbreviation });
                toast.success("YouTube link deleted successfully");
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

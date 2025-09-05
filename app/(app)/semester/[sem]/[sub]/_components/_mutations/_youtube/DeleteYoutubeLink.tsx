import { deleteYoutubeLink } from "@/lib/actions/Youtube.actions";
import { Loader2, Trash } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";

const DeleteYoutubeLink = ({
  id,
  abbreviation,
}: {
  id: string;
  abbreviation: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteYoutubeLink({ id }),
    onSuccess: () => {
      toast.success("YouTube link deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["youtube", abbreviation],
      });
      queryClient.invalidateQueries({
        queryKey: ["userYoutubeLinks", user!.name],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete the video.");
      console.error(error);
    },
  });

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
          <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteYoutubeLink;

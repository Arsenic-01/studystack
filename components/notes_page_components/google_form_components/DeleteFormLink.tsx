import { deleteFormLink } from "@/lib/actions/Form.actions";
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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";

const DeleteFormLink = ({
  id,
  abbreviation,
}: {
  id: string;
  semester: string;
  abbreviation: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteFormLink({ id }),
    onSuccess: () => {
      toast.success("Link deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["forms", abbreviation],
      });
      queryClient.invalidateQueries({
        queryKey: ["userYoutubeLinks", user!.name],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete the link.");
      console.error(error);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-fit">
          <Trash />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the Google
          Form link.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default DeleteFormLink;

import { deleteFormLink } from "@/lib/actions/Form.actions";
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

import { useQueryClient } from "@tanstack/react-query";

const DeleteFormLink = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mt-2 w-full">
          <Trash />
          Delete Form
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
          <AlertDialogAction
            onClick={async () => {
              try {
                await deleteFormLink(id);
                toast.success("Google Form link deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["formLinks"] });
              } catch (error) {
                toast.error("Failed to delete the Google Form link.");
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

export default DeleteFormLink;

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteNote } from "@/lib/actions/Notes.actions";
import { Note } from "@/lib/appwrite_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteNoteButtonProps {
  note: Note;
  userName: string | undefined;
  onSuccess?: () => void; // Optional: Callback for when deletion succeeds
}

export function DeleteNoteButton({
  note,
  userName,
  onSuccess,
}: DeleteNoteButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutate, isPending } = useMutation({
    mutationFn: () => deleteNote({ noteId: note.noteId, fileId: note.fileId }),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      // Invalidate queries to refetch the notes list
      queryClient.invalidateQueries({ queryKey: ["notes", note.abbreviation] });
      if (userName) {
        queryClient.invalidateQueries({ queryKey: ["userNotes", userName] });
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note. Please try again.");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none text-red-500 hover:text-red-600"
        >
          Delete Note
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the note
            titled &quot;{note.title}&quot; and its associated file from the
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent dialog from closing immediately on click
              deleteNoteMutate();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

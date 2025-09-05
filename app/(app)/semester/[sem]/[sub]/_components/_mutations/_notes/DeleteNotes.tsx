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
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteNoteButtonProps {
  note: Note;
  userName: string | undefined;
  onSuccess: () => void;
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
      queryClient.invalidateQueries({ queryKey: ["notes", note.abbreviation] });
      if (userName) {
        queryClient.invalidateQueries({ queryKey: ["userNotes", userName] });
      }
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note. Please try again.");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start rounded-none">
          <Trash />
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
              e.preventDefault();
              deleteNoteMutate();
            }}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // <-- Import Popover components
import { deleteNote } from "@/lib/actions/Notes.actions";
import { Note } from "@/lib/appwrite_types";
import { EllipsisVertical, Info, Loader2 } from "lucide-react";
import { useState } from "react";
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
import EditNotesModal from "../crud_notes/EditNotesModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";

function formatFileSize(bytes: string | number) {
  const num = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(num)) return "Unknown";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}

const CardOwner = ({
  note,
  formattedDate,
}: {
  note: Note;
  formattedDate: string;
}) => {
  const { user } = useUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const closeModal = () => {
    setEditModalOpen(false);
  };

  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      deleteNote({
        noteId: note.noteId,
        fileId: note.fileId,
      }),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["notes", note.abbreviation], // Invalidate notes for this subject
      });
      setPopoverOpen(false); // Close the popover on success
    },
    onError: () => toast.error("Error deleting note"),
  });

  // State to control Popover visibility, so we can close it from a button click
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size={"icon"}>
            {user?.id === note.users.userId || user?.role === "admin" ? (
              <EllipsisVertical />
            ) : (
              <Info />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 py-2 px-0">
          <div className="space-y-2 pt-1">
            <p className="text-sm font-medium px-3">
              Uploaded by {note.users.name}
            </p>
            <hr className="border-t-1 border-neutral-300 dark:border-neutral-800" />
            <p className="text-sm text-muted-foreground px-3 pt-2">
              At: {formattedDate}
            </p>
            <p className="text-sm text-muted-foreground px-3">
              File size: {formatFileSize(note.fileSize)}
            </p>
            <p className="text-sm text-muted-foreground pb-2 px-3">
              Mime type: {note.mimeType}
            </p>

            {(user?.id === note.users.userId || user?.role === "admin") && (
              <>
                <hr className="border-t-1 border-neutral-300 dark:border-neutral-800" />
                <p className="text-sm font-medium pt-1 px-2">Actions</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none"
                  onClick={() => {
                    setEditModalOpen(true);
                    setPopoverOpen(false);
                  }}
                >
                  Edit Note
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none"
                    >
                      Delete Note
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the note.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteNoteMutate()}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
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
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* The EditModal is separate and controlled by its own state */}
      {editModalOpen && (
        <EditNotesModal
          semester={note.semester}
          abbreviation={note.abbreviation}
          open={editModalOpen}
          closeModal={closeModal}
          noteId={note.noteId}
          title={note.title}
          description={note.description}
          type_of_file={note.type_of_file!}
        />
      )}
    </>
  );
};

export default CardOwner;

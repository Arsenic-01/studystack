"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteNote } from "@/lib/actions/Notes.actions";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditNotesModal from "../crud_notes/EditNotesModal";
import { NoteCardProps } from "./NoteCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

const CardOwner = ({
  note,
  formattedDate,
  fileName,
  fileSize,
}: NoteCardProps & {
  formattedDate: string;
  fileName?: string;
  fileSize?: string;
}) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      document.body.style.removeProperty("pointer-events");
    }, 300);
  };
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteNote({ noteId: note.noteId, fileId: note.fileId })
      .then(() => {
        toast.success("Note deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["subjectNotes"] });
      })
      .catch(() => toast.error("Error deleting note"));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            {user?.userId === note.users.userId || user?.role === "admin" ? (
              <EllipsisVertical />
            ) : (
              <Info />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Uploaded by {note.users.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Uploaded at {formattedDate}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            File Name: {fileName || "Unknown"}
          </DropdownMenuLabel>
          <DropdownMenuLabel>
            File Size: {fileSize || "Unknown"}
          </DropdownMenuLabel>

          {(user?.userId === note.users.userId || user?.role === "admin") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Edit Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAlertOpen(true)}>
                Delete Note
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {open && (
        <EditNotesModal
          open={open}
          closeModal={closeModal}
          noteId={note.noteId}
          title={note.title}
          description={note.description}
          type_of_file={note.type_of_file!}
        />
      )}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the note.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAlertOpen(false);
                setTimeout(() => {
                  document.body.style.removeProperty("pointer-events");
                }, 300);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setAlertOpen(false);
                setTimeout(() => {
                  document.body.style.removeProperty("pointer-events");
                }, 300);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CardOwner;

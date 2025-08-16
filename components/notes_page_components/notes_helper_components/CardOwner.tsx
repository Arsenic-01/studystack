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
import { Note } from "@/lib/appwrite_types";
import { useAuthStore } from "@/store/authStore";
import { EllipsisVertical, Info } from "lucide-react";
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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import EditNotesModal from "../crud_notes/EditNotesModal";

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
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      document.body.style.removeProperty("pointer-events");
    }, 300);
  };

  const handleDelete = () => {
    deleteNote({
      noteId: note.noteId,
      fileId: note.fileId,
      semester: note.semester,
      abbreviation: note.abbreviation,
    })
      .then(() => {
        toast.success("Note deleted successfully");
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
          <DropdownMenuLabel>File Name: {note.title}</DropdownMenuLabel>
          <DropdownMenuLabel>
            File size: {formatFileSize(note.fileSize)}
          </DropdownMenuLabel>
          <DropdownMenuLabel>Mime type: {note.mimeType}</DropdownMenuLabel>

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
          semester={note.semester}
          abbreviation={note.abbreviation}
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

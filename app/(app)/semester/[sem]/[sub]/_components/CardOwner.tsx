"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { Note, SessionUser } from "@/lib/appwrite_types";
import { Edit, EllipsisVertical, Info } from "lucide-react";
import { useState } from "react";
import { DeleteNoteButton } from "./_mutations/_notes/DeleteNotes";
import EditNotesModal from "./_mutations/_notes/EditNotesModal";

function formatFileSize(bytes: string | number) {
  const num = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}
interface CardOwnerProps {
  note: Note;
  formattedDate: string;
  serverUser?: SessionUser | null;
}

export default function CardOwner({
  note,
  formattedDate,
  serverUser,
}: CardOwnerProps) {
  const { user: clientUser } = useUser();
  const user = serverUser ?? clientUser;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const hasPermission =
    user?.id === note.users.userId || user?.role === "admin";

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size={"icon"}>
            {hasPermission ? <EllipsisVertical /> : <Info />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 py-2 px-0">
          <div className="space-y-2 pt-1">
            <p className="px-3 text-sm font-medium">
              Uploaded by {note.users.name}
            </p>
            <hr className="border-t border-neutral-300 dark:border-neutral-800" />
            <div className="px-3 pt-2 space-y-1 text-sm text-muted-foreground">
              <p>At: {formattedDate}</p>
              <p>File size: {formatFileSize(note.fileSize)}</p>
              <p className="pb-1">Mime type: {note.mimeType}</p>
            </div>

            {hasPermission && (
              <>
                <hr className="border-t border-neutral-300 dark:border-neutral-800" />
                <p className="px-2 pt-1 text-sm font-medium">Actions</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none"
                  onClick={() => {
                    setEditModalOpen(true);
                    setPopoverOpen(false);
                  }}
                >
                  <Edit />
                  Edit Note
                </Button>
                <DeleteNoteButton
                  note={note}
                  userName={user?.name}
                  onSuccess={() => setPopoverOpen(false)}
                />
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {editModalOpen && (
        <EditNotesModal
          user={user}
          semester={note.semester}
          abbreviation={note.abbreviation}
          open={editModalOpen}
          closeModal={() => setEditModalOpen(false)}
          noteId={note.noteId}
          title={note.title}
          description={note.description}
          type_of_file={note.type_of_file!}
        />
      )}
    </>
  );
}

"use client";

import NoteCard from "@/components/notes_page_components/notes_helper_components/NoteCard";
import { Button } from "@/components/ui/button";
import { getUserNotes } from "@/lib/actions/Notes.actions";
import { Note } from "@/lib/appwrite_types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const NOTES_PER_PAGE = 6;

interface NotesTabClientProps {
  initialNotes: Note[];
  totalNotes: number;
  userName: string;
}

export default function NotesTabClient({
  initialNotes,
  totalNotes,
  userName,
}: NotesTabClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [offset, setOffset] = useState(initialNotes.length);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreNotes = async () => {
    setIsLoading(true);
    const { documents: newNotes } = await getUserNotes({
      userName,
      limit: NOTES_PER_PAGE,
      offset,
    });
    setNotes((prev) => [...prev, ...newNotes]);
    setOffset((prev) => prev + newNotes.length);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: Note) => (
          <NoteCard key={note.noteId} note={note} />
        ))}
      </div>
      {notes.length < totalNotes && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMoreNotes} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

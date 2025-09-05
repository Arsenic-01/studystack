"use client";

import NoteCard from "@/app/(app)/semester/[sem]/[sub]/_components/_cards/NoteCard";
import { Button } from "@/components/ui/button";
import { getUserNotes } from "@/lib/actions/Notes.actions";
import { Note } from "@/lib/appwrite_types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const NOTES_PER_PAGE = 6;

interface NotesTabClientProps {
  initialNotes: { documents: Note[]; total: number };
  userName: string;
}

export default function NotesTabClient({
  initialNotes,
  userName,
}: NotesTabClientProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["userNotes", userName],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await getUserNotes({
          userName,
          limit: NOTES_PER_PAGE,
          offset: pageParam,
        });
        return { ...res, offset: pageParam };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentCount = lastPage.offset + lastPage.documents.length;
        if (currentCount < lastPage.total) {
          return currentCount;
        }
        return undefined;
      },
      initialData: {
        pages: [
          {
            documents: initialNotes.documents,
            total: initialNotes.total,
            offset: 0,
          },
        ],
        pageParams: [0],
      },
      staleTime: 5 * 60 * 1000,
    });

  const notes = data?.pages.flatMap((page) => page.documents) ?? [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: Note) => (
          <NoteCard key={note.noteId} note={note} />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

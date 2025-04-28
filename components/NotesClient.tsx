"use client";

import NotesFilter from "@/components/notes-filter";
import { fetchNotesBySubject } from "@/lib/actions/Notes.actions";
import { useQuery } from "@tanstack/react-query";
import NotesFilterSkeleton from "./NotesFilterSkeleton";

interface NotesClientProps {
  subjectId: string;
  subjectName: string;
  subjectUnits: string[];
  semester: number;
}

const NotesClient = ({
  subjectId,
  subjectName,
  subjectUnits,
  semester,
}: NotesClientProps) => {
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subjectNotes", subjectId],
    queryFn: () => fetchNotesBySubject({ sub: subjectId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <NotesFilterSkeleton />;
  }

  if (error) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <NotesFilter
      notes={notes!}
      subjectName={subjectName}
      subjectId={subjectId}
      subjectUnits={subjectUnits}
      semester={String(semester)}
    />
  );
};

export default NotesClient;

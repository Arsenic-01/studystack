import { fetchNotesBySubject } from "@/lib/actions/Notes.actions";
import { NoteCard } from "@/components/note-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchSubject } from "@/lib/actions/Subjects.actions";

const Page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;
  const notes = await fetchNotesBySubject({ sub });

  const res = await fetchSubject({ subjectId: sub });

  // Fetch preview URLs for all notes
  const notesWithPreviews = await Promise.all(
    notes.map(async (note) => {
      return { ...note };
    })
  );

  // Get the subject name from the first note in the array
  const subjectName = res?.name;
  return (
    <div className="container mx-auto py-28 sm:py-32 xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row  gap-5 sm:gap-10 mb-14">
        <Button variant="outline" className="w-fit" asChild>
          <Link href={res ? `/semester/${res?.semester}` : `/home`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tighter">
          {subjectName ? `Notes for ${subjectName}` : "Invalid Subject URL"}
        </h1>
      </div>

      {notesWithPreviews && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notesWithPreviews.map((note) => (
            <NoteCard key={note.noteId} note={note} />
          ))}
        </div>
      )}
      {!notes.length && <div className="">No Notes found</div>}
    </div>
  );
};

export default Page;

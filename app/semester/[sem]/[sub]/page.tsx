import NotesFilter from "@/components/notes-filter";
import { fetchNotesBySubject } from "@/lib/actions/Notes.actions";
import { fetchSubject } from "@/lib/actions/Subjects.actions";

const Page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;
  const notes = await fetchNotesBySubject({ sub });
  const res = await fetchSubject({ subjectId: sub });

  return (
    <NotesFilter
      notes={notes}
      subjectName={res?.name}
      semester={res?.semester}
    />
  );
};

export default Page;

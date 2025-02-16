import { fetchNotesBySubject } from '@/lib/actions/Notes.actions';
import { fetchNotesForPreview } from '@/lib/actions/Notes.actions'; // Adjust the import
import { NoteCard } from '@/components/note-card';

const Page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;
  const notes = await fetchNotesBySubject({ sub });

  // Fetch preview URLs for all notes
  const notesWithPreviews = await Promise.all(
    notes.map(async (note) => {
      const previewUrl = await fetchNotesForPreview(note.fileId);
      return { ...note, previewUrl };
    })
  );

  // Get the subject name from the first note in the array
  const subjectName = notesWithPreviews[0]?.subject?.name || 'Unknown Subject';

  return (
    <div className='container mx-auto py-32 xl:py-36 max-w-6xl px-5'>
      <h1 className='text-3xl font-bold mb-8'>Notes for {subjectName}</h1>
      {notesWithPreviews && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {notesWithPreviews.map((note) => (
            <NoteCard
              key={note.noteId}
              note={note}
              previewUrl={note.previewUrl}
            />
          ))}
        </div>
      )}
      {!notes.length && <div className=''>No Notes found</div>}
    </div>
  );
};

export default Page;

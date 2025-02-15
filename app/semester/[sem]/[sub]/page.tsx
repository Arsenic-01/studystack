// import { fetchNotes } from "@/lib/actions/Notes.actions";
import Upload from "@/components/upload";
import { fetchNotesBySubject } from "@/lib/actions/Notes.actions";
import React from "react";

const page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;
  const res = await fetchNotesBySubject({ sub });
  console.log("response of fetch Subject = ", res);
  const notes = res;
  // console.log(sub);
  const subject = sub;
  return (
    <div>
      {notes.map((note) => (
        <div key={note.$id} className="note-card">
          <a href={note.fileUrl} target="_blank">
            View Note
          </a>
          <p>{note.name}</p>
        </div>
      ))}
      <Upload subject={subject} />
    </div>
  );
};

export default page;

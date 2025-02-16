import { create } from "zustand";

interface Note {
  noteId: string;
  users: string; // Change this to an array if multiple users can be associated
  sem: number;
  createdAt: string;
  fileId: string;
  title: string;
  description: string;
  subjectId: string;
}

interface NotesStore {
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (noteId: string) => void;
  setNotes: (notes: Note[]) => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),
  removeNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.noteId !== noteId),
    })),
  setNotes: (notes) => set({ notes }),
}));

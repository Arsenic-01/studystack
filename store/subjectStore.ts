import { create } from "zustand";
import { Subject } from "@/lib/appwrite_types";

interface SubjectsStore {
  subjects: Subject[]; // Store the list of subjects
  selectedSubject: Subject | null; // Store the currently selected subject
  setSubjects: (subjects: Subject[]) => void; // Set all subjects
  setSelectedSubject: (subject: Subject) => void; // Set only the selected subject
}

export const useSubjectStore = create<SubjectsStore>((set) => ({
  subjects: [], // Initial empty list of subjects
  selectedSubject: null, // Initially no subject is selected
  setSubjects: (subjects) => set({ subjects }), // Set the list of subjects
  setSelectedSubject: (subject) =>
    set((state) => {
      // Only update selected subject if it's different from the current one
      if (state.selectedSubject?.subjectId !== subject.subjectId) {
        return { selectedSubject: subject };
      }
      return {}; // Don't update if the subject is the same
    }),
}));

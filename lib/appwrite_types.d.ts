interface UserProps {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  resetTokenExpiry: string;
  resetToken: string;
  sessionToken: string;
  createdAt: Date;
}

export interface updateUserData {
  id: string;
  prnNo?: string;
  name?: string;
  email?: string;
  role: "admin" | "student" | "teacher";
  teacherSem?: number;
  password?: string;
}

export type Note = {
  noteId: string;
  title: string;
  description: string;
  createdAt: string;
  fileId: string;
  sem: string;
  subjectId: string;
  users: { name: string; userId: string };
  type_of_file:
    | "Notes"
    | "PPTS"
    | "Assignments"
    | "SLA"
    | "Lab_Manuals"
    | "Modal_Solutions"
    | "MSBTE_QP"
    | "Videos"
    | "Animations"
    | "Programs"
    | "Syllabus"
    | "Other";
  unit: string[];
};

export interface Subject {
  subjectId: string;
  name: string;
  abbreviation: string;
  code: string;
  semester: string;
  unit: string[];
}

export interface Youtube {
  id: string;
  title: string;
  youtubeLink: string;
  subjectId: string;
  abbreviation: string;
  semester: string;
  createdBy: string;
}

export interface Form {
  id: string;
  createdBy: string;
  url: string;
  subjectId: string;
  quizName: string;
}

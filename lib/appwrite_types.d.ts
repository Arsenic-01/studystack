export interface User {
  userId: string;
  prnNo: string;
  name: string;
  email: string;
  role: "admin" | "student" | "teacher";
  createdAt: string;
  sessionToken?: string | null;
  lastLogin?: Date | null;
  teacherSem?: number;
  uploadedNotes?: string[];
  usersAdded?: string[];
  usersRemoved?: string[];
}

export interface Teacher extends User {
  userId: string;
  prnNo: string;
  name: string;
  email: string;
  role: "teacher";
  createdAt: string;
  sessionToken?: string | null;
  lastLogin?: Date | null;
  teacherSem?: number;
  uploadedNotes?: string[];
}

export interface Student extends User {
  userId: string;
  prnNo: string;
  name: string;
  email: string;
  role: "student";
  createdAt: string;
  sessionToken?: string | null;
  lastLogin?: Date | null;
}

export interface Admin extends User {
  userId: string;
  prnNo: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: string;
  sessionToken?: string | null;
  lastLogin?: Date | null;
}
interface UserProps {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  lastLogin?: string;
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
  users: { name: string };
  subject: { name: string };
  previewUrl?: string; // Add previewUrl as optional
};

export interface Subject {
  subjectId: string;
  name: string;
  code: string;
  semester: string;
  notes?: Note[];
}

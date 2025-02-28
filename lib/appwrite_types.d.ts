interface UserProps {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  loginData: string[];
  sessionStart: string[];
  sessionEnd?: string[];
  resetTokenExpiry: string;
  resetToken: string;
  lastLogin: string;
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
  subject: { name: string };
  type_of_file?: string;
  unit: string[];
};

export interface Subject {
  subjectId: string;
  name: string;
  code: string;
  semester: string;
  notes?: Note[];
  unit?: string[];
}

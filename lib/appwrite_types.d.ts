interface UserProps {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  loginData: string[];
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
    | "Modal_Solutions"
    | "MSBTE_QP"
    | "Videos"
    | "Animations"
    | "Programs"
    | "Other";
  unit: string[];
};

export interface Subject {
  subjectId: string;
  name: string;
  code: string;
  semester: string;
  unit: string[];
}

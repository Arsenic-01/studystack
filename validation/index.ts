import { z } from "zod";

export const loginSchema = z.object({
  prnNo: z
    .string()
    .length(10, "PRN Number must be exactly 10 digits")
    .regex(/^\d{10}$/, "PRN Number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  prnNo: z
    .string()
    .length(10, "PRN Number must be exactly 10 digits")
    .regex(/^\d{10}$/, "PRN Number must contain only digits"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const editNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type_of_file: z.enum(
    [
      "Notes",
      "PPTS",
      "Assignments",
      "Modal_Solutions",
      "SLA",
      "Lab_Manuals",
      "MSBTE_QP",
      "Videos",
      "Animations",
      "Programs",
      "Syllabus",
      "Other",
    ],
    { message: "Please select a file type" }
  ),
});

export const uploadNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  fileType: z.enum(
    [
      "Notes",
      "PPTS",
      "Assignments",
      "Modal_Solutions",
      "SLA",
      "Lab_Manuals",
      "MSBTE_QP",
      "Videos",
      "Animations",
      "Programs",
      "Syllabus",
      "Other",
    ],
    { message: "Please select a file type" }
  ),
  unit: z.string().min(1, "Please select a unit"),
});

export const signUpFormSchema = z.object({
  prnNo: z
    .string()
    .length(10, "PRN No must be exactly 10 digits")
    .regex(/^[0-9]{10}$/, "PRN No must be numeric"),
  name: z.string().min(6, "Full Name must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "student"]),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  userType: z.enum(["student", "staff"]),
  class: z.string().optional(),
  messageType: z.enum(["error", "suggestion"]),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export const apiContactForm = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  userType: z.enum(["student", "staff"]),
  class: z.string().optional(),
  messageType: z.enum(["error", "suggestion"]),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export const subjectSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  semester: z.coerce
    .number()
    .min(1, "Semester is required")
    .max(6, "Invalid semester, should be between 1 and 6"),

  units: z
    .array(z.string().min(3, "Unit name must be at least 3 characters"))
    .nonempty("At least one unit is required"),
});

export const editSubjectSchema = z.object({
  subjectId: z.string(),
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  semester: z
    .string()
    .min(1, "Semester is required")
    .max(6, "Invalid semester"),
  units: z.array(z.string().min(3, "Unit name must be at least 3 characters")),
});

export const youtubeSchema = z.object({
  youtubeLink: z
    .string()
    .min(1, "YouTube link is required")
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/,
      "Invalid YouTube URL"
    ),
  title: z.string().min(3, "Title must be at least 3 characters"),
});

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const linkSchema = z.discriminatedUnion("formType", [
  z.object({
    formType: z.literal("googleForm"),
    name: z.string().min(1, "Name is required"),
    url: z
      .string()
      .min(1, "Google Form link is required")
      .regex(
        /^(https?:\/\/)?(www\.)?docs\.google\.com\/forms\/d\/e\/[a-zA-Z0-9_-]+\/viewform/,
        "Invalid Google Form URL format"
      ),
  }),
  z.object({
    formType: z.literal("assignment"),
    name: z.string().min(1, "Name is required"),
    url: z
      .string()
      .min(1, "Assignment link is required")
      .regex(urlRegex, "Invalid URL"),
  }),
  z.object({
    formType: z.literal("other"),
    name: z.string().min(1, "Name is required"),
    url: z.string().min(1, "Link is required").regex(urlRegex, "Invalid URL"),
  }),
]);

export type LinkSchemaType = z.infer<typeof linkSchema>;

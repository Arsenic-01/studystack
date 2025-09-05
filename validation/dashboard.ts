import { z } from "zod";

export const dashboardUploadNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  semester: z.string().min(1, "Please select a semester."),
  subject: z.string().min(1, "Please select a subject."),
  unit: z.string().min(1, "Please select a unit."),
  type_of_file: z.string().min(1, "Please select a file type."),
});

export const dashboardYoutubeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  youtubeLink: z.string().url("Please enter a valid YouTube URL."),
  semester: z.string().min(1, "Please select a semester."),
  subject: z.string().min(1, "Please select a subject."),
});

export const dashboardLinkSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  url: z.string().url("Please enter a valid URL."),
  formType: z.enum(["googleForm", "assignment", "other"]),
  semester: z.string().min(1, "Please select a semester."),
  subject: z.string().min(1, "Please select a subject."),
});

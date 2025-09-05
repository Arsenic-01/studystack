"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { saveNoteMetadata } from "@/lib/actions/Notes.actions";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const dashboardUploadNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  semester: z.string().min(1, "Please select a semester."),
  subject: z.string().min(1, "Please select a subject."),
  unit: z.string().min(1, "Please select a unit."),
  type_of_file: z.string().min(1, "Please select a file type."),
});

type UploadNoteFormValues = z.infer<typeof dashboardUploadNoteSchema>;
interface UploadNotesFormProps {
  onSuccess: () => void;
}

export default function UploadNotesForm({ onSuccess }: UploadNotesFormProps) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<UploadNoteFormValues>({
    resolver: zodResolver(dashboardUploadNoteSchema),
    defaultValues: {
      title: "",
      description: "",
      semester: "",
      subject: "",
      unit: "",
      type_of_file: "Notes",
    },
  });

  const selectedSemester = form.watch("semester");
  const selectedSubjectAbbr = form.watch("subject");

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects", selectedSemester],
    queryFn: async () => {
      if (!selectedSemester) return [];
      const result = await fetchSubjectsBySemester(parseInt(selectedSemester));
      return result || [];
    },
    enabled: !!selectedSemester,
  });

  const selectedSubject = subjects?.find(
    (s) => s.abbreviation === selectedSubjectAbbr
  );

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) setSelectedFile(files[0]);
  };

  const directUploadToDrive = (uploadUrl: string, file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream"
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload."));
      };

      xhr.send(file);
    });
  };

  const onSubmit = async (values: UploadNoteFormValues) => {
    if (!selectedFile || !user) {
      toast.error("Please select a file and ensure you are logged in.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get the signed URL for direct upload
      const initRes = await fetch("/api/initiate-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type || "application/octet-stream",
        }),
      });
      const initJson = await initRes.json();
      if (!initRes.ok || !initJson?.uploadUrl) {
        throw new Error(
          initJson?.error || "Failed to start Drive upload session."
        );
      }
      const uploadUrl: string = initJson.uploadUrl;

      // Step 2: Upload the file directly to Google Drive
      const driveResponse = await directUploadToDrive(uploadUrl, selectedFile);
      const driveFileId = driveResponse?.id;
      if (!driveFileId) {
        throw new Error("Drive did not return a file ID on completion.");
      }
      setUploadProgress(100);

      // Step 3: Call the server action to save metadata
      const result = await saveNoteMetadata({
        fileId: driveFileId,
        title: values.title,
        description: values.description,
        type_of_file: values.type_of_file,
        unit: values.unit,
        semester: values.semester,
        userId: user.id,
        userName: user.name,
        abbreviation: values.subject,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to save note metadata.");
      }

      toast.success("File Uploaded Successfully! 🎉");
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["notes", values.subject] });
      queryClient.invalidateQueries({ queryKey: ["userNotes", user!.name] });

      onSuccess();
    } catch (err: unknown) {
      console.error("Upload process failed", err);
      toast.error(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(6)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        Semester {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedSemester || isLoadingSubjects}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem
                        key={subject.abbreviation}
                        value={subject.abbreviation}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedSubject}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedSubject?.unit?.map((unit, index) => (
                      <SelectItem key={index} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type_of_file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of file" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Notes">Notes</SelectItem>
                    <SelectItem value="PPTS">PPT</SelectItem>
                    <SelectItem value="MSBTE_QP">MSBTE_QP</SelectItem>
                    <SelectItem value="Modal_Solutions">
                      Modal Solutions
                    </SelectItem>
                    <SelectItem value="SLA">SLA</SelectItem>
                    <SelectItem value="Assignments">Assignment</SelectItem>
                    <SelectItem value="Lab_Manuals">Lab Manual</SelectItem>
                    <SelectItem value="Videos">Videos</SelectItem>
                    <SelectItem value="Animations">Animation</SelectItem>
                    <SelectItem value="Programs">Programs</SelectItem>
                    <SelectItem value="Syllabus">Syllabus</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FileUpload onChange={handleFileChange} />

        {uploading && uploadProgress !== null && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center mt-1 text-muted-foreground">
              {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={uploading || !selectedFile}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload Note
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

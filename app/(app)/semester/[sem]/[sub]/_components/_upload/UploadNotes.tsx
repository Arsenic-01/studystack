"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { uploadNoteSchema } from "@/validation";
import { saveNoteMetadata } from "@/lib/actions/Notes.actions";
import { SessionUser } from "@/lib/appwrite_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the form schema type
type UploadFormValues = z.infer<typeof uploadNoteSchema>;

interface UploadNotesProps {
  semester: string;
  subjectUnit: string[];
  abbreviation: string;
  user: SessionUser | null;
}

interface DriveUploadResponse {
  kind: "drive#file";
  id: string;
  name: string;
  mimeType: string;
}

// Helper function for direct XHR upload to get progress

const directUploadToDrive = (
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<DriveUploadResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      // A successful upload to a resumable session URL returns the file resource JSON
      if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseText) {
          // Safely parse and cast the JSON response
          const responseJson = JSON.parse(
            xhr.responseText
          ) as DriveUploadResponse;
          resolve(responseJson);
        } else {
          // It's an unexpected success state if the response is empty
          reject(new Error("Upload succeeded but received an empty response."));
        }
      } else {
        reject(
          new Error(
            `Upload failed with status: ${xhr.status} - ${xhr.responseText}`
          )
        );
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(file);
  });
};

export function UploadNotes({
  semester,
  subjectUnit,
  abbreviation,
  user,
}: UploadNotesProps) {
  const [open, setOpen] = useState(false);

  if (user?.role !== "teacher" && user?.role !== "admin") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full px-5 py-2 w-full sm:w-auto sm:mr-3"
          variant={"outline"}
        >
          Upload Notes <Upload className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Notes</DialogTitle>
        </DialogHeader>
        <UploadNotesForm
          abbreviation={abbreviation}
          semester={semester}
          subjectUnit={subjectUnit}
          userId={user.id}
          userName={user.name}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function UploadNotesForm({
  onSuccess,
  ...props
}: Omit<UploadNotesProps, "user"> & {
  userId: string;
  userName: string;
  onSuccess: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadNoteSchema),
    defaultValues: { title: "", description: "" },
  });

  // `useMutation` to handle the entire async upload flow.
  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (data: UploadFormValues) => {
      if (!selectedFile) throw new Error("Please select a file to upload.");

      // Step 1: Get pre-signed URL from our API
      const initRes = await fetch("/api/initiate-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });
      const initJson = await initRes.json();
      if (!initRes.ok)
        throw new Error(initJson.error || "Failed to start upload session.");

      // Step 2: Upload the file directly, tracking progress
      const driveResponse = await directUploadToDrive(
        initJson.uploadUrl,
        selectedFile,
        setUploadProgress
      );
      const driveFileId = driveResponse?.id;
      if (!driveFileId) throw new Error("Drive did not return a file ID.");

      // Step 3: Save metadata to our database via a Server Action
      const result = await saveNoteMetadata({
        fileId: driveFileId,
        title: data.title,
        description: data.description,
        type_of_file: data.fileType,
        unit: data.unit,
        semester: props.semester,
        userId: props.userId,
        userName: props.userName,
        abbreviation: props.abbreviation,
      });

      if (!result.success)
        throw new Error(result.error || "Failed to save note metadata.");
    },
    onSuccess: () => {
      toast.success("File Uploaded Successfully! 🎉");
      queryClient.invalidateQueries({
        queryKey: ["notes", props.abbreviation],
      });
      form.reset();
      setSelectedFile(null);
      onSuccess(); // Call the callback to close the dialog
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setUploadProgress(0);
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit((data) => uploadFile(data))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Notes Title" {...field} />
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
              <FormControl>
                <Input placeholder="Enter Notes Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.subjectUnit.length > 0 && (
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.subjectUnit.map((unit, i) => (
                        <SelectItem key={i} value={unit}>
                          <span className="flex justify-start items-start w-[350px] lg:w-full truncate">
                            {unit}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="fileType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of file" />
                  </SelectTrigger>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full min-h-32 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={(files) => setSelectedFile(files[0] || null)} />
        </div>

        {isPending && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center mt-1 text-muted-foreground">
              {uploadProgress}% Complete
            </p>
          </div>
        )}

        <div className="flex w-full justify-end items-center mt-2">
          <Button
            type="submit"
            className="w-full sm:w-fit"
            disabled={isPending || !selectedFile}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isPending ? `Uploading...` : "Upload Notes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

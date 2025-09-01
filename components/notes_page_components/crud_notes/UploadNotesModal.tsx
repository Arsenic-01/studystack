"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { uploadNoteSchema } from "@/components/validation_schema/validation";
import { saveNoteMetadata } from "@/lib/actions/Notes.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UploadNotesModalProps {
  open: boolean;
  closeModal: () => void;
  semester: string;
  userId: string;
  userName: string;
  subjectUnit: string[];
  abbreviation: string;
}

const UploadNotesModal: React.FC<UploadNotesModalProps> = ({
  open,
  closeModal,
  semester,
  userId,
  userName,
  subjectUnit,
  abbreviation,
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const form = useForm({
    resolver: zodResolver(uploadNoteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const directUploadToDrive = (uploadUrl: string, file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      // IMPORTANT: Do NOT set the Authorization header here.
      // The uploadUrl is a pre-signed URL and acts as the token.
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream"
      ); // Track upload progress

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      }; // Handle completion

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(
            new Error(
              `Upload failed with status: ${xhr.status} - ${xhr.responseText} - ${xhr.responseType} - ${xhr.response} - ${xhr.statusText}`
            )
          );
        }
      }; // Handle errors

      xhr.onerror = () => {
        reject(
          new Error(
            `Network error during upload. ${xhr.statusText} - ${xhr.responseText} - ${xhr.status} - ${xhr.responseType} - ${xhr.response}`
          )
        );
      };

      xhr.send(file);
    });
  };

  const handleFileUpload = async (data: {
    title: string;
    description: string;
    fileType: string;
    unit: string;
  }) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadProgress(0); // Reset progress

    try {
      // 1) Start resumable session (This part remains the same)
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
      const uploadUrl: string = initJson.uploadUrl; // 2) UPLOAD DIRECTLY TO GOOGLE DRIVE (The new, efficient way)

      const driveResponse = await directUploadToDrive(uploadUrl, selectedFile);
      const driveFileId = driveResponse?.id;

      if (!driveFileId) {
        throw new Error("Drive did not return a file ID on completion.");
      }
      setUploadProgress(100); // Ensure it hits 100% on success
      // 3) Save your metadata (This part remains the same)

      const result = await saveNoteMetadata({
        fileId: driveFileId,
        title: data.title,
        description: data.description,
        type_of_file: data.fileType,
        unit: data.unit,
        semester: semester,
        userId: userId,
        userName: userName,
        abbreviation: abbreviation,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to save note metadata.");
      }

      toast.success("File Uploaded Successfully! 🎉");
      closeModal();
      form.reset();
      setSelectedFile(null);
    } catch (err: unknown) {
      console.error("Upload process failed", err);
      toast.error(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(null); // Clear progress on finish/error
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFile(files[0] || null);
  };
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="mb-5 lg:mb-0">Upload Notes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleFileUpload)}
          >
            {/* Title Input */}
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
            {/* Description Input */}
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
            {subjectUnit.length > 0 && (
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectUnit.map((unit, index) => (
                            <SelectItem key={index} value={unit} className="">
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
            {/* File Type Selection */}
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
            {/* File Upload */}
            <div className="w-full min-h-32 border border-dashed bg-white dark:bg-black border-neutral-300 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleFileSelect} />
            </div>
            {uploading && uploadProgress !== null && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center mt-1 text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
            )}
            <div className="flex w-full justify-end items-center mt-4">
              <Button
                type="submit"
                className="w-full sm:w-fit"
                disabled={uploading || !selectedFile}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Notes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Close Button */}
        {/* <DialogClose asChild>
          <Button className="w-full mt-2 lg:mt-0" variant="secondary">
            Close
          </Button>
        </DialogClose> */}
      </DialogContent>
    </Dialog>
  );
};

export default UploadNotesModal;

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadNoteSchema } from "@/components/validation_schema/validation";
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

  const form = useForm({
    resolver: zodResolver(uploadNoteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB (below Vercel Hobby 4.5MB limit)

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
    try {
      // 1) Start resumable session
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

      // 2) Chunked upload
      const total = selectedFile.size;
      let offset = 0;
      let driveFileId: string | null = null;

      while (offset < total) {
        const end = Math.min(offset + CHUNK_SIZE, total);
        const chunk = selectedFile.slice(offset, end);
        const contentRange = `bytes ${offset}-${end - 1}/${total}`;

        // Send chunk → our proxy → Drive
        const res = await fetch("/api/upload-chunk", {
          method: "POST",
          headers: {
            "x-upload-url": uploadUrl,
            "x-content-range": contentRange,
            "x-content-type": selectedFile.type || "application/octet-stream",
            "Content-Length": String(chunk.size),
          },
          body: chunk,
        });

        const json = await res.json();

        if (!res.ok || json?.success === false) {
          console.error("Chunk upload failure:", json);
          throw new Error(
            json?.error || `Chunk upload failed at ${offset}-${end - 1}`
          );
        }

        // Mid-upload normalized response: { resume: true, range }
        if (json.resume) {
          offset = end;
          // You can show progress UI here:
          // const pct = Math.round((end / total) * 100);
          // setProgress(pct);
          continue;
        }

        // Final response: { resume: false, data: { id, ... } }
        if (json.resume === false) {
          driveFileId = json?.data?.id ?? null;
          offset = end;
        }
      }

      if (!driveFileId) {
        throw new Error("Drive did not return a file ID on completion.");
      }

      // 3) Save your metadata (your existing API)
      const saveRes = await fetch("/api/save-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: driveFileId,
          title: data.title,
          description: data.description,
          type_of_file: data.fileType,
          unit: data.unit,
          semester,
          userId,
          userName,
          abbreviation,
        }),
      });
      const saveJson = await saveRes.json();
      if (!saveRes.ok || !saveJson?.success) {
        throw new Error(saveJson?.error || "Failed to save note metadata.");
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
            <div className="w-full min-h-32 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleFileSelect} />
            </div>

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
                    Upload Note
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

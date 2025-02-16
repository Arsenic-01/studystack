"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define validation schema using Zod
const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

interface UploadNotesModalProps {
  open: boolean;
  closeModal: () => void;
  subjectId: string | null;
  sem: number | null;
  userId: string | null;
}

const UploadNotesModal: React.FC<UploadNotesModalProps> = ({
  open,
  closeModal,
  subjectId,
  sem,
  userId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
  });

  const handleFileUpload = async (data: {
    title: string;
    description: string;
  }) => {
    if (!selectedFiles.length || !subjectId || !sem || !userId) return;

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("subjectId", subjectId);
    formData.append("sem", String(sem));
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("File Uploaded Successfully! 🎉");
        closeModal();
      } else {
        console.log("Something went wrong, please try again.");

        console.error("Upload error:", result.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Notes</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-6 mt-5"
          onSubmit={handleSubmit(handleFileUpload)}
        >
          <div className="flex flex-col gap-3">
            <Input placeholder="Enter Notes Title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <Input
              placeholder="Enter Notes Description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="w-full min-h-32 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={setSelectedFiles} />
          </div>

          <Button
            type="submit"
            className="w-full mx-auto flex items-center gap-2"
            disabled={uploading || !selectedFiles.length}
          >
            {uploading ? "Uploading..." : "Upload Notes"}
            <ArrowUpRight size={16} />
          </Button>
        </form>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNotesModal;

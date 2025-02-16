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
import { useNotesStore } from "@/store/noteStore";
import { ArrowUpRight } from "lucide-react";

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
  const { addNote } = useNotesStore();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = async () => {
    if (!selectedFiles.length || !subjectId || !sem || !userId) return;

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("files", file));
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
        console.log("Files uploaded successfully", result.uploadedFiles);
        result.uploadedFiles.forEach((file: any) => addNote(file)); // ✅ Update Zustand store
        setSelectedFiles([]);
        closeModal();
      } else {
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Notes</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="w-full min-h-40 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={setSelectedFiles} />
          </div>
          <Button
            className="w-fit mx-auto flex items-center gap-2"
            onClick={handleFileUpload}
            disabled={uploading || !selectedFiles.length || !subjectId || !sem}
          >
            {uploading ? "Uploading..." : "Upload Notes"}
            <ArrowUpRight size={16} />
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNotesModal;

"use client";
import React, { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { useNotesStore } from "@/store/noteStore";

export function FileUploadDemo({
  subjectId,
  sem,
  userId,
}: {
  subjectId: string | null;
  sem: number | null;
  userId: string | null;
}) {
  console.log(subjectId, sem, userId);

  const { addNote } = useNotesStore();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = async () => {
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
        setSelectedFiles([]);

        // Update Zustand store
        result.uploadedFiles.forEach((file: any) => addNote(file));
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
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={setSelectedFiles} />
      </div>
      <Button
        className="w-fit mx-auto flex items-center gap-2"
        onClick={handleFileChange}
        disabled={uploading || !selectedFiles.length || !subjectId || !sem}
      >
        {uploading ? "Uploading..." : "Upload Notes"}
        <ArrowUpRight size={16} />
      </Button>
    </div>
  );
}

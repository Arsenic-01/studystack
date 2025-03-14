"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// Define validation schema using Zod
const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  fileType: z.enum(
    [
      "Notes",
      "PPTS",
      "Modal_Solutions",
      "MSBTE_QP",
      "Videos",
      "Animations",
      "Programs",
      "Other",
    ],
    { message: "Please select a file type" }
  ),
  unit: z.string().min(1, "Please select a unit"),
});

interface UploadNotesModalProps {
  open: boolean;
  closeModal: () => void;
  subjectId: string;
  sem: string;
  userId: string;
  userName: string;
  subjectUnit: string[];
}

const UploadNotesModal: React.FC<UploadNotesModalProps> = ({
  open,
  closeModal,
  subjectId,
  sem,
  userId,
  userName,
  subjectUnit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFileUpload = async (data: {
    title: string;
    description: string;
    fileType: string;
    unit: string;
  }) => {
    if (!selectedFiles.length || !subjectId || !sem || !userId) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("fileType", data.fileType);
    formData.append("subjectId", subjectId);
    formData.append("sem", sem);
    formData.append("userId", userId);
    formData.append("userName", userName);
    formData.append("unit", data.unit); // Sending selected unit

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("File Uploaded Successfully! 🎉");
        closeModal();
        form.reset();
      } else {
        console.error("Upload error:", result.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };
  // console.log(subjectUnit);
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
                        <SelectItem value="PPTS">PPTs</SelectItem>
                        <SelectItem value="MSBTE_QP">MSBTE_QPs</SelectItem>
                        <SelectItem value="Modal_Solutions">
                          Modal Solutions
                        </SelectItem>
                        <SelectItem value="Videos">Videos</SelectItem>
                        <SelectItem value="Animations">Animation</SelectItem>
                        <SelectItem value="Programs">Programs</SelectItem>
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
              <FileUpload onChange={setSelectedFiles} />
            </div>

            {/* Upload Button */}
            <Button
              type="submit"
              className="w-full flex items-center gap-2"
              disabled={uploading || !selectedFiles.length}
            >
              {uploading ? "Uploading..." : "Upload Notes"}
              <Upload />
            </Button>
          </form>
        </Form>

        {/* Close Button */}
        <DialogClose asChild>
          <Button className="w-full mt-2 lg:mt-0" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNotesModal;

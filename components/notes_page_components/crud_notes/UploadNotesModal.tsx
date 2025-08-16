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
import { Upload } from "lucide-react";
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

  const handleFileUpload = async (data: {
    title: string;
    description: string;
    fileType: string;
    unit: string;
  }) => {
    if (!selectedFile || !semester || !userId) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("fileType", data.fileType);
    formData.append("semester", semester);
    formData.append("userId", userId);
    formData.append("userName", userName);
    formData.append("unit", data.unit);
    formData.append("abbreviation", abbreviation);
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
        setSelectedFile(null);
      } else {
        console.error("Upload error:", result.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
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

            {/* Upload Button */}
            <div className="flex w-full justify-end items-center mt-4">
              <Button
                type="submit"
                className="w-full sm:w-fit flex items-center gap-2"
                disabled={uploading || !selectedFile}
              >
                {uploading ? "Uploading..." : "Upload Notes"}
                <Upload />
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

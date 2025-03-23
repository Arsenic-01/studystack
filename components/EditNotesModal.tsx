"use client";

import { Button } from "@/components/ui/button";
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
import { editNotes } from "@/lib/actions/Notes.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FilePen } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Define validation schema using Zod
const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type_of_file: z.enum(
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
});

interface EditNotesModalProps {
  open: boolean;
  closeModal: () => void;
  noteId: string;
  title: string;
  description: string;
  type_of_file:
    | "Notes"
    | "PPTS"
    | "Modal_Solutions"
    | "MSBTE_QP"
    | "Videos"
    | "Animations"
    | "Programs"
    | "Other";
  fromAdmin?: boolean;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({
  open,
  closeModal,
  noteId,
  title,
  description,
  type_of_file,
  fromAdmin,
}) => {
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: title,
      description: description,
      type_of_file: type_of_file,
    },
  });

  const handleEditNotes = async (data: {
    title: string;
    description: string;
    type_of_file: string;
  }) => {
    if (!data.title || !data.description || !data.type_of_file) return;

    setUploading(true);

    try {
      const response = await editNotes({
        noteId,
        title: data.title,
        description: data.description,
        type_of_file: data.type_of_file,
      });

      if (!response || response.error) {
        throw new Error(response?.error || "Unknown error occurred");
      }

      toast.success("Note updated successfully!");
      closeModal();
      if (fromAdmin) {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      } else queryClient.invalidateQueries({ queryKey: ["subjectNotes"] });
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update note.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {open && (
        <Dialog open={open} onOpenChange={closeModal}>
          <DialogContent className="lg:max-w-md 2xl:max-w-lg">
            <DialogHeader>
              <DialogTitle className="mb-5 lg:mb-0">Edit Note</DialogTitle>
            </DialogHeader>
            <div>
              <Form {...form}>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={form.handleSubmit(handleEditNotes)}
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
                          <Input
                            placeholder="Enter Notes Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Type Selection */}
                  <FormField
                    control={form.control}
                    name="type_of_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the type of file" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Notes">Notes</SelectItem>
                              <SelectItem value="PPTS">PPTs</SelectItem>
                              <SelectItem value="MSBTE_QP">
                                MSBTE_QPs
                              </SelectItem>
                              <SelectItem value="Modal_Solutions">
                                Modal Solutions
                              </SelectItem>
                              <SelectItem value="Videos">Videos</SelectItem>
                              <SelectItem value="Animations">
                                Animation
                              </SelectItem>
                              <SelectItem value="Programs">Programs</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full flex items-center gap-2 mt-3"
                    disabled={uploading}
                  >
                    {uploading ? "Updating..." : "Update Note"} <FilePen />
                  </Button>
                </form>
              </Form>
              <Button
                className="w-full mt-2"
                variant="secondary"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditNotesModal;

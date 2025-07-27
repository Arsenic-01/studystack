import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Subject } from "@/lib/appwrite_types";
import { updateSubject } from "@/lib/actions/Subjects.actions";
import { editSubjectSchema } from "@/components/validation_schema/validation";

interface EditSubjectModalProps {
  open: boolean;
  closeModal: () => void;
  subject: Subject;
}

// TypeScript type from schema
type SubjectFormData = z.infer<typeof editSubjectSchema>;

const EditSubjectModal = ({
  open,
  closeModal,
  subject,
}: EditSubjectModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [newUnit, setNewUnit] = useState("");

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(editSubjectSchema),
    defaultValues: {
      subjectId: subject.subjectId,
      name: subject.name,
      code: subject.code,
      semester: subject.semester,
      units: subject.unit,
    },
  });

  // Set up field array for units
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units",
  });

  const addNewUnit = () => {
    if (newUnit && newUnit.trim().length >= 3) {
      append(newUnit.trim());
      setNewUnit("");
    } else if (newUnit.trim()) {
      toast.error("Unit name must be at least 3 characters");
    }
  };

  const handleSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);

    try {
      await updateSubject({
        subjectId: data.subjectId,
        name: data.name,
        code: data.code,
        semester: data.semester,
        unit: data.units,
      });
      toast.success("Subject updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      closeModal();
    } catch (error) {
      toast.error("Failed to update subject");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Subject
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-2"
          >
            {/* Subject Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Subject name"
                      className="transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. CS101"
                      className="transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Semester */}
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Fall 2023"
                      className="transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Units */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Units</FormLabel>
              <div className="flex flex-wrap gap-2 p-2 border border-neutral-200 dark:border-neutral-800 rounded-md min-h-10">
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground px-1">
                    No units added yet
                  </p>
                )}

                {fields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5 flex items-center gap-1"
                  >
                    {form.watch(`units.${index}`)}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-1 rounded-full hover:bg-muted hover:text-foreground transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a unit"
                  className="transition-all duration-200"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewUnit();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addNewUnit}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {form.formState.errors.units?.message && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.units.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="transition-all duration-200 mt-2 md:mt-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className=" transition-all duration-200"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectModal;

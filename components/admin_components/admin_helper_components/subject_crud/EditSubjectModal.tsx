"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editSubjectSchema } from "@/components/validation_schema/validation";
import { Subject } from "@/lib/appwrite_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { FieldArrayPath, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditSubjectModalProps {
  open: boolean;
  closeModal: () => void;
  subject: Subject;
  onSubjectUpdate: (data: Subject) => void;
}

// TypeScript type from schema
type SubjectFormData = z.infer<typeof editSubjectSchema>;

const EditSubjectModal = ({
  open,
  closeModal,
  subject,
  onSubjectUpdate,
}: EditSubjectModalProps) => {
  const [newUnit, setNewUnit] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(editSubjectSchema),
    defaultValues: {
      subjectId: subject.subjectId,
      name: subject.name,
      abbreviation: subject.abbreviation,
      code: subject.code,
      semester: subject.semester,
      units: subject.unit,
    },
  });

  const { fields, append, remove } = useFieldArray<
    SubjectFormData,
    FieldArrayPath<SubjectFormData>
  >({
    control: form.control,
    name: "units" as FieldArrayPath<SubjectFormData>,
  });

  const addNewUnit = () => {
    if (newUnit && newUnit.trim().length >= 3) {
      append(newUnit.trim());
      setNewUnit("");
    } else if (newUnit.trim()) {
      toast.error("Unit name must be at least 3 characters");
    }
  };

  const handleSubmit = (data: SubjectFormData) => {
    startTransition(() => {
      const subjectData: Subject = {
        subjectId: data.subjectId,
        name: data.name,
        abbreviation: data.abbreviation,
        code: data.code,
        semester: data.semester,
        unit: data.units,
      };
      onSubjectUpdate(subjectData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Subject
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
            Update the details of the subject.
          </DialogDescription>
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

            <div className="flex justify-center items-center gap-2 w-full">
              {/* Subject Abbreviation */}
              <FormField
                control={form.control}
                name="abbreviation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Subject Abbr.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. bms"
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
                  <FormItem className="w-full">
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 311302"
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
                  <FormItem className="w-full">
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 1"
                        className="transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectModal;

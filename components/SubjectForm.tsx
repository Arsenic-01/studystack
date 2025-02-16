"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ID } from "node-appwrite";

const subjectSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  semester: z.number().int().min(1).max(6, "Semester must be between 1 and 6"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export default function SubjectForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = async (data: SubjectFormData) => {
    setLoading(true);
    const subjectId = ID.unique(); // Generate unique ID
    try {
      const res = await fetch("/api/addsub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subjectId }),
      });
      if (!res.ok) throw new Error("Failed to add subject");
      toast.success("Subject added successfully!");
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to add subject:", error);
      toast.error("Failed to add subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-neutral-300 dark:border-neutral-800"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Subject Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter subject name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Subject Code</Label>
        <Input
          id="code"
          {...register("code")}
          placeholder="Enter subject code"
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Input
          id="semester"
          type="number"
          {...register("semester", { valueAsNumber: true })}
          placeholder="Enter semester (1-6)"
        />
        {errors.semester && (
          <p className="text-sm text-red-500">{errors.semester.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Add Subject"}
      </Button>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { dashboardLinkSchema } from "@/validation/dashboard";
import { useUser } from "@/hooks/useUser";
import { createFormLink } from "@/lib/actions/Form.actions";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UploadLinkValues = z.infer<typeof dashboardLinkSchema>;
interface UploadLinkFormProps {
  onSuccess: () => void;
}

export default function UploadLinkForm({ onSuccess }: UploadLinkFormProps) {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<UploadLinkValues>({
    resolver: zodResolver(dashboardLinkSchema),
    defaultValues: {
      name: "",
      url: "",
      formType: "googleForm",
      semester: "",
      subject: "",
    },
  });

  const selectedSemester = form.watch("semester");

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects", selectedSemester],
    queryFn: async () => {
      if (!selectedSemester) return [];
      const result = await fetchSubjectsBySemester(parseInt(selectedSemester));
      return result || [];
    },
    enabled: !!selectedSemester,
  });

  const onSubmit = async (values: UploadLinkValues) => {
    setUploading(true);
    try {
      const result = await createFormLink({
        quizName: values.name,
        googleFormLink: values.url,
        formType: values.formType,
        semester: values.semester,
        abbreviation: values.subject,
        createdBy: user!.name!,
      });
      if (!result.success) throw new Error(result.error);
      toast.success("Link added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["forms", values.subject] });
      queryClient.invalidateQueries({ queryKey: ["userForms", user!.name] });
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add link."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mid-term Exam Quiz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://forms.gle/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a link type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="googleForm">Google Form</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(6)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        Semester {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedSemester || isLoadingSubjects}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingSubjects ? "Loading..." : "Select a subject"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem
                        key={subject.abbreviation}
                        value={subject.abbreviation}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Link...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Add Link
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

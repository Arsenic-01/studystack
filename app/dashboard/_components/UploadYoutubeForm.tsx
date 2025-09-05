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
import { dashboardYoutubeSchema } from "@/components/validation_schema/dashboard_schema";
import { useUser } from "@/hooks/useUser";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { createYoutubeLink } from "@/lib/actions/Youtube.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UploadYoutubeValues = z.infer<typeof dashboardYoutubeSchema>;
interface UploadYoutubeFormProps {
  onSuccess: () => void;
}
export default function UploadYoutubeForm({
  onSuccess,
}: UploadYoutubeFormProps) {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<UploadYoutubeValues>({
    resolver: zodResolver(dashboardYoutubeSchema),
    defaultValues: { title: "", youtubeLink: "", semester: "", subject: "" },
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

  const onSubmit = async (values: UploadYoutubeValues) => {
    setUploading(true);
    try {
      const result = await createYoutubeLink({
        title: values.title,
        youtubeLink: values.youtubeLink,
        semester: values.semester,
        abbreviation: values.subject,
        createdBy: user!.name!,
      });
      if (!result.success) throw new Error(result.error);
      toast.success("YouTube link added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["youtube", values.subject] });
      queryClient.invalidateQueries({
        queryKey: ["userYoutubeLinks", user!.name],
      });
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add youtube link."
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Java Full Course for Beginners"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtubeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...field}
                />
              </FormControl>
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
              <Upload className="mr-2 h-4 w-4" /> Add YouTube Link
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

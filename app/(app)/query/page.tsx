"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, HelpCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import {
  getTeachers,
  sendQueryEmail,
} from "@/app/(client)/(marketing)/contact/actions";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";

const queryFormSchema = z.object({
  teacherId: z.string({
    required_error: "Please select a teacher to route your query to.",
  }),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters.")
    .max(100, "Subject must not exceed 100 characters."),
  message: z
    .string()
    .min(
      10,
      "Please describe your query in more detail (minimum 10 characters).",
    )
    .max(2000, "Query is too long. Please keep it under 2000 characters."),
});

type QueryFormValues = z.infer<typeof queryFormSchema>;

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function QueriesPage() {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: teachers = [], isLoading: isFetching } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
    staleTime: 1000 * 60 * 60, // Keep data fresh for 1 hour
  });

  const form = useForm<QueryFormValues>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: { teacherId: "", subject: "", message: "" },
  });

  async function onSubmit(values: QueryFormValues) {
    if (!user) return toast.error("User session not found.");

    const selectedTeacher = teachers.find((t) => t.id === values.teacherId);
    if (!selectedTeacher) return;

    try {
      const result = await sendQueryEmail({
        teacherEmail: selectedTeacher.email,
        teacherName: selectedTeacher.name,
        studentName: user.name,
        studentEmail: user.email!,
        subject: values.subject,
        message: values.message,
      });

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit query.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto w-full min-h-screen py-24 sm:py-32 max-w-5xl px-5 xl:px-0">
      <div className="space-y-6">
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300 shadow-sm">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p>
            <span className="font-semibold">Tip : </span> Please ensure your
            question hasn&apos;t already been answered in the latest lecture
            notes before submitting a new query.
          </p>
        </div>

        <Card
          className="border rounded-lg sm:border-neutral-300 dark:sm:border-neutral-800 shadow-sm w-full bg-white dark:bg-neutral-950"
          suppressHydrationWarning
        >
          <CardHeader className="pb-4 px-4 pt-5 md:p-6">
            <div className="flex flex-col space-y-2 sm:space-y-1">
              <h1 className="text-2xl tracking-tighter font-bold flex items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Query Details
              </h1>
              <h2 className="text-sm text-neutral-500 dark:text-neutral-400">
                Fill out the information below. Be as specific as possible.
              </h2>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 p-4 md:p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Teacher Selection */}
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route to Teacher</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a faculty member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject Line */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Question regarding Deadlocks in Operating System"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Question</FormLabel>
                      <FormControl>
                        <div
                          data-color-mode={
                            resolvedTheme === "dark" ? "dark" : "light"
                          }
                        >
                          <MDEditor
                            value={field.value}
                            onChange={field.onChange}
                            preview="edit"
                            height={200}
                            textareaProps={{
                              placeholder:
                                "Explain your doubt here. Use the toolbar for code blocks or bold text...",
                            }}
                            className="border-neutral-300 dark:border-neutral-800"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-neutral-500 dark:text-neutral-400 text-xs">
                        Confirm that your question is clear and concise. Avoid
                        vague queries to ensure a prompt response from the
                        professor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Query
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

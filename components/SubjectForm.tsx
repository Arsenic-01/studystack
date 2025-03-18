"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Plus, X } from "lucide-react";
import { ID } from "node-appwrite";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ✅ Define Zod Schema
const subjectSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  semester: z.coerce
    .number()
    .int()
    .min(1)
    .max(6, "Semester must be between 1 and 6"),
  units: z
    .array(z.string().min(5, "Unit name must be at least 5 characters"))
    .nonempty("At least one unit is required"),
});

// ✅ TypeScript Type
type SubjectFormData = z.infer<typeof subjectSchema>;

export default function SubjectForm() {
  const [loading, setLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // ✅ Initialize Form
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: "", code: "", semester: 1, units: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units",
  });

  // ✅ Form Submission Handler
  const onSubmit = async (data: SubjectFormData) => {
    setLoading(true);
    const subjectId = ID.unique();

    try {
      const res = await fetch("/api/addsub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subjectId }),
      });

      if (!res.ok) throw new Error("Failed to add subject");
      setFormSuccess(true);
      toast.success("Subject added successfully!");

      // Reset form after successful submission
      setTimeout(() => {
        form.reset({ name: "", code: "", semester: 1, units: [""] });
        setFormSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to add subject:", error);
      toast.error("Failed to add subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <Card
        className={cn(
          "bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 shadow-lg transition-all duration-300",
          formSuccess &&
            "border-green-500 dark:border-green-500 shadow-green-100 dark:shadow-green-900/20"
        )}
      >
        <CardHeader className="pb-7">
          <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-white">
            Subject Details
          </CardTitle>
          <CardDescription>
            Fill in the information about the subject
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subject Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {/* <BookOpen className="h-4 w-4 text-purple-500" /> */}
                      Subject Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Operating Systems"
                        className="border-neutral-300 dark:border-neutral-800"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      Enter the full name of the subject
                    </FormDescription> */}
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
                    <FormLabel className="flex items-center gap-2">
                      {/* <CodeIcon className="h-4 w-4 text-blue-500" /> */}
                      Subject Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="22516"
                        className="border-neutral-300 dark:border-neutral-8000"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      The unique code identifying this subject
                    </FormDescription> */}
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
                    <FormLabel className="flex items-center gap-2">
                      {/* <Calendar className="h-4 w-4 text-green-500" /> */}
                      Semester
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="6"
                        placeholder="1"
                        className="border-neutral-300 dark:border-neutral-800 "
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      Which semester is this subject taught in (1-6)
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Units Section */}
              <div className="space-y-4 pt-4">
                <FormLabel className="flex items-center gap-2 text-neutral-900 dark:text-white">
                  {/* <Layers className="h-4 w-4 text-orange-500" /> */}
                  Units
                </FormLabel>
                {/* <FormDescription className="mt-0">
                  Add the units that make up this subject
                </FormDescription> */}

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`units.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-end gap-2 mb-0">
                          <FormControl>
                            <div className="relative flex-1">
                              <Input
                                {...field}
                                placeholder="Overview of Operating System"
                                className="pr-10 h-10 border-neutral-300 dark:border-neutral-800 "
                              />
                            </div>
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-10 w-10 p-0 m-0 border-neutral-300 dark:border-neutral-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 p-0" />
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append("")}
                  className="mt-2 border-dashed border-2 w-full justify-center text-neutral-500 hover:text-neutral-700 hover:border-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-700"
                >
                  <Plus className="mr-0 md:mr-2 h-4 w-4" />
                  Add Unit
                </Button>
              </div>

              {/* Submit Button */}
              <CardFooter className="px-0 pt-6 pb-0 flex justify-end">
                <Button
                  type="submit"
                  className={cn(
                    "w-full sm:w-auto transition-all",
                    loading && "opacity-80",
                    formSuccess && "bg-green-500 hover:bg-green-600"
                  )}
                  disabled={loading || formSuccess}
                >
                  {loading ? (
                    <>Processing...</>
                  ) : formSuccess ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Subject Added
                    </span>
                  ) : (
                    "Add Subject"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

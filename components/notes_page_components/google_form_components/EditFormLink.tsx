"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  linkSchema,
  LinkSchemaType,
} from "@/components/validation_schema/validation";
import { editFormLink } from "@/lib/actions/Form.actions";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// --- CHANGE 1: Update props to include formType ---
const EditFormLink = ({
  open,
  onOpenChange,
  id,
  url,
  quizName,
  formType: initialFormType, // Receive the initial form type
  semester,
  abbreviation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  id: string;
  url: string;
  quizName: string;
  formType: "googleForm" | "assignment" | "other";
  semester: string;
  abbreviation: string;
}) => {
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const form = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      formType: initialFormType,
      name: quizName ?? "",
      url: url ?? "",
    },
  });

  const formType = form.watch("formType");

  useEffect(() => {
    form.reset({
      formType: initialFormType,
      name: quizName,
      url: url,
    });
  }, [quizName, url, initialFormType, form]);

  const modalContent = {
    googleForm: {
      title: "Edit Google Form",
      description: "Update the name or link for this Google Form.",
      namePlaceholder: "Enter Quiz Name",
      urlPlaceholder: "Enter Google Form Link",
    },
    assignment: {
      title: "Edit Assignment Link",
      description: "Update the name or link for this assignment.",
      namePlaceholder: "Enter Assignment Title",
      urlPlaceholder: "Enter Assignment Link",
    },
    other: {
      title: "Edit External Link",
      description: "Update the name or link for this resource.",
      namePlaceholder: "Enter Link Name",
      urlPlaceholder: "Enter URL",
    },
  };

  const currentContent = modalContent[formType];

  const { mutate, isPending } = useMutation({
    mutationFn: (values: LinkSchemaType) =>
      editFormLink({
        id,
        quizName: values.name,
        googleFormLink: values.url,
        formType: values.formType,
        semester,
        abbreviation,
      }),
    onSuccess: () => {
      toast.success("Link updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["forms", abbreviation], // Invalidate the 'forms' query
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating link:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  // 4. Update the submit handler
  const handleFormLinkUpdate = (values: LinkSchemaType) => {
    mutate(values);
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentContent.title}</DialogTitle>
              <DialogDescription>
                {currentContent.description}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormLinkUpdate)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="formType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.resetField("url");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="googleForm">
                            Google Form
                          </SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={currentContent.namePlaceholder}
                          {...field}
                        />
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
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={currentContent.urlPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditFormLink;

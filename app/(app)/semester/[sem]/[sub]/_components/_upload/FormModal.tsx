// GoogleFormModal.tsx component

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/search-dialog";
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
import { linkSchema, LinkSchemaType } from "@/validation";
import { createFormLink } from "@/lib/actions/Form.actions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaLink } from "react-icons/fa6";
import { toast } from "sonner";
import { SessionUser } from "@/lib/appwrite_types";

const GoogleFormModal = ({
  abbreviation,
  semester,
  user,
}: {
  abbreviation: string;
  semester: string;
  user: SessionUser | null;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      formType: "googleForm",
      name: "",
      url: "",
    },
  });

  const formType = form.watch("formType");

  const modalContent = {
    googleForm: {
      title: "Add Google Form",
      description: "Paste the 'viewform' link of your quiz or survey.",
      namePlaceholder: "Enter Quiz Name",
      urlPlaceholder: "Enter Google Form Link",
    },
    assignment: {
      title: "Add Assignment Link",
      description:
        "Provide a link to the assignment details or submission page.",
      namePlaceholder: "Enter Assignment Title",
      urlPlaceholder: "Enter Assignment Link",
    },
    other: {
      title: "Add External Link",
      description: "Add any other relevant link for this subject.",
      namePlaceholder: "Enter Link Name",
      urlPlaceholder: "Enter URL",
    },
  };

  const currentContent = modalContent[formType];

  const handleFormSubmit = async (values: LinkSchemaType) => {
    if (!user?.name) {
      toast.error("You must be logged in to add a link.");
      return;
    }

    const payload = {
      title: values.name,
      googleFormLink: values.url,
      formType: values.formType,
      createdBy: user.name,
      abbreviation: abbreviation,
      semester: semester,
    };

    const response = await createFormLink(payload);
    if (response) {
      toast.success("Link added successfully!");
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["forms", abbreviation] });
    } else {
      toast.error("Failed to add link. Please try again.");
    }
  };

  return (
    <>
      {(user?.role === "teacher" || user?.role === "admin") && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="rounded-full w-full md:w-fit p-2"
              variant="outline"
            >
              <FaLink className="size-2" />
              <span className="md:hidden inline">Add Link</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{currentContent.title}</DialogTitle>
              <DialogDescription>
                {currentContent.description}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
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
                          // Reset URL field to clear previous validation errors
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Adding..." : "Add Link"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GoogleFormModal;

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { googleFormSchema } from "@/components/validation_schema/validation";
import { editFormLink } from "@/lib/actions/Form.actions";

import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Link, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditFormLink = ({
  id,
  url,
  quizName,
}: {
  id: string;
  url: string;
  quizName: string;
}) => {
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(googleFormSchema),
    defaultValues: {
      googleFormLink: url ?? "",
      quizName: quizName ?? "",
    },
  });

  const handleFormLinkUpdate = async (values: {
    googleFormLink: string;
    quizName: string;
  }) => {
    try {
      await editFormLink({
        googleFormLink: values.googleFormLink,
        quizName: values.quizName,
        id,
      });
      toast.success("Google Form link updated successfully");

      queryClient.invalidateQueries({ queryKey: ["formLinks"] });
      form.reset();
    } catch (error) {
      console.error("Error updating Google Form link:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 w-fit">
              Edit
              <Pencil />
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Google Form Link</DialogTitle>
              <DialogDescription className="pb-5 lg:pb-0">
                Copy the link from Google Forms and paste it here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormLinkUpdate)}
                className="flex gap-2 justify-between items-center"
              >
                <FormField
                  control={form.control}
                  name="quizName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter Quiz Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="googleFormLink"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          id="link"
                          placeholder="Enter Google Form link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Update Link</span>
                  <Link />
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

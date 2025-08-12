"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "lucide-react";
import { useForm } from "react-hook-form";

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
import {
  googleFormSchema,
  GoogleFormSchemaType,
} from "@/components/validation_schema/validation";
import { useAuthStore } from "@/store/authStore";
import { IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";
import { createFormLink } from "@/lib/actions/Form.actions";
import { useQueryClient } from "@tanstack/react-query";

const GoogleFormModal = ({ subjectId }: { subjectId: string }) => {
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<GoogleFormSchemaType>({
    resolver: zodResolver(googleFormSchema),
    defaultValues: {
      quizName: "",
      googleFormLink: "",
    },
  });

  // Handle form submission
  const handleGoogleFormEmbed = async (values: GoogleFormSchemaType) => {
    if (!user?.name) {
      toast.error("You must be logged in to embed a Google Form.");
      return;
    }

    const payload = {
      quizName: values.quizName,
      googleFormLink: values.googleFormLink,
      createdBy: user.name,
      subjectId,
    };

    const response = await createFormLink(payload);
    if (response) {
      toast.success("Google Form link uploaded successfully");
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["googleFormLinks", subjectId],
      });
    }
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="rounded-full w-full md:w-fit p-2"
              variant="outline"
            >
              <IconBrandGoogle />
              <span className="md:hidden inline">Google Form</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-md">
            <DialogHeader>
              <DialogTitle>Embed Google Form</DialogTitle>
              <DialogDescription className="pb-5 lg:pb-0">
                Copy the link from Google Forms and paste it here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleGoogleFormEmbed)}
                className="flex flex-col md:flex-row gap-2 justify-between items-center"
              >
                <FormField
                  control={form.control}
                  name="quizName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Enter Quiz Name"
                          {...field}
                          className="w-full"
                        />
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
                          placeholder="Enter Your Google Form Link"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="mt-2 px-3 w-full md:w-fit"
                >
                  <span className="md:hidden block">Embed Google Form</span>
                  <span className="sr-only">Embed</span>
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

export default GoogleFormModal;

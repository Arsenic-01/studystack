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
import { youtubeSchema } from "@/components/validation_schema/validation";
import { editYoutubeLink } from "@/lib/actions/Youtube.actions";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query"; // ✅ Import useQueryClient
import { Edit, Pencil } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditYoutubeLink = ({
  id,
  url,
  title,
  semester,
  abbreviation,
}: {
  id: string;
  url: string;
  title: string;
  semester: string;
  abbreviation: string;
}) => {
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient(); // ✅ Initialize queryClient

  const form = useForm({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      youtubeLink: url,
      title: title,
    },
  });
  useEffect(() => {
    form.reset({
      youtubeLink: url,
      title: title,
    });
  }, [url, title, form]);

  const handleYoutubeEmbed = async (values: {
    youtubeLink: string;
    title: string;
  }) => {
    try {
      await editYoutubeLink({
        youtubeLink: values.youtubeLink,
        id,
        title: values.title,
        semester,
        abbreviation,
      });
      toast.success("YouTube video embed updated successfully");
      form.reset({ youtubeLink: values.youtubeLink, title: values.title });
      queryClient.invalidateQueries({ queryKey: ["youtubeLinks"] });
    } catch (error) {
      console.error("Error updating YouTube link:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 w-full">
              <Pencil />
              Edit Video
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Embed Link</DialogTitle>
              <DialogDescription className="pb-5 lg:pb-0">
                Copy the link from YouTube and paste it here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleYoutubeEmbed)}
                className="flex flex-col md:flex-row gap-2 justify-between items-center"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          id="title"
                          placeholder={"Enter YouTube Title"}
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
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          id="link"
                          placeholder={"Enter YouTube link"}
                          {...field}
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
                  <span className="sr-only">Update Link</span>
                  <span className="md:hidden">Update Youtube Link</span>
                  <Edit />
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditYoutubeLink;

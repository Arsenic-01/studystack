"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
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
import { youtubeSchema } from "@/components/validation_schema/validation";
import { createYoutubeLink } from "@/lib/actions/Youtube.actions";
import { useQueryClient } from "@tanstack/react-query";
import { FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { SessionUser } from "@/lib/appwrite_types";

const YoutubeModal = ({
  abbreviation,
  semester,
  user,
}: {
  abbreviation: string;
  semester: string;
  user: SessionUser | null;
}) => {
  const queryClient = useQueryClient();
  // Initialize form with react-hook-form and Zod validation
  const form = useForm({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      youtubeLink: "",
      title: "",
    },
  });

  // Handle form submission
  const handleYoutubeEmbed = async (values: {
    youtubeLink: string;
    title: string;
  }) => {
    try {
      const response = await createYoutubeLink({
        title: values.title,
        youtubeLink: values.youtubeLink,
        semester: semester,
        abbreviation: abbreviation,
        createdBy: user!.name!,
      });
      if (!response.success) throw new Error(response.error);
      toast.success("YouTube link added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["youtube", abbreviation] });
    } catch (error) {
      console.error("Error uploading YouTube link:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add youtube link."
      );
    }
  };

  return (
    <>
      {(user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="rounded-full w-full md:w-fit p-2"
              variant="outline"
            >
              <FaYoutube />
              <span className="md:hidden inline">Youtube Video</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-md">
            <DialogHeader>
              <DialogTitle>Embed YouTube Videos</DialogTitle>
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
                          placeholder="Enter Your Title"
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
                          placeholder="Enter Your YouTube Video Link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="mt-2 md:mt-0 px-3 w-full md:w-fit"
                >
                  <span className="sr-only">Add Link</span>
                  <span className="md:hidden">Add Youtube Link</span>
                  <PlusCircle />
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default YoutubeModal;

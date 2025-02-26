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
import { editYoutubeLink } from "@/lib/actions/Youtube.actions";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query"; // ✅ Import useQueryClient
import { Link, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define Zod schema for YouTube URL validation
const youtubeSchema = z.object({
  youtubeLink: z
    .string()
    .min(1, "YouTube link is required")
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/,
      "Invalid YouTube URL"
    ),
});

const EditYoutubeLink = ({ id, url }: { id: string; url: string }) => {
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient(); // ✅ Initialize queryClient

  const form = useForm({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      youtubeLink: url,
    },
  });

  const handleYoutubeEmbed = async (values: { youtubeLink: string }) => {
    try {
      await editYoutubeLink({ youtubeLink: values.youtubeLink, id });
      toast.success("YouTube video embed updated successfully");

      // ✅ Invalidate cache to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["youtubeLinks"] });

      form.reset(); // Reset form on success
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
                className="flex gap-2 justify-between items-center"
              >
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
                <Button type="submit" size="sm" className="px-3">
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

export default EditYoutubeLink;

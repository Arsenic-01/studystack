"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useAuthStore } from "@/store/authStore";
import { IconBrandYoutube } from "@tabler/icons-react";
import { toast } from "sonner";

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

const YoutubeModal = ({ subjectId }: { subjectId: string }) => {
  const { user, isLoggedIn } = useAuthStore();

  // Initialize form with react-hook-form and Zod validation
  const form = useForm({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      youtubeLink: "",
    },
  });

  // Handle form submission
  const handleYoutubeEmbed = async (values: { youtubeLink: string }) => {
    try {
      const payload = {
        youtubeLink: values.youtubeLink,
        user: user?.name, // Ensure user name is included
        subjectId: subjectId,
      };

      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Upload error:", result.error);
        toast.error(result.error || "Failed to embed video.");
      } else {
        toast.success("YouTube video embedded successfully");
        form.reset(); // Reset form on success
      }
    } catch (error) {
      console.error("Error uploading YouTube link:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full" size="icon" variant="outline">
              <IconBrandYoutube />
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
                          placeholder="Enter Your YouTube Video Link"
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

export default YoutubeModal;

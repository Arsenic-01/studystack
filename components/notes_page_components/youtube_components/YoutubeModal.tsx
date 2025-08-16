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
import { youtubeSchema } from "@/components/validation_schema/validation";
import { useAuthStore } from "@/store/authStore";
import { IconBrandYoutube } from "@tabler/icons-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const YoutubeModal = ({
  subjectId,
  abbreviation,
  semester,
}: {
  subjectId: string;
  abbreviation: string;
  semester: string;
}) => {
  const { user, isLoggedIn } = useAuthStore();
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
      const payload = {
        youtubeLink: values.youtubeLink,
        user: user?.name,
        subjectId: subjectId,
        abbreviation: abbreviation,
        semester: semester,
        title: values.title,
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
        queryClient.invalidateQueries({
          queryKey: ["youtubeLinks", subjectId],
        });
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
            <Button
              className="rounded-full w-full md:w-fit p-2"
              variant="outline"
            >
              <IconBrandYoutube />
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
                className="flex gap-2 justify-between items-center"
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

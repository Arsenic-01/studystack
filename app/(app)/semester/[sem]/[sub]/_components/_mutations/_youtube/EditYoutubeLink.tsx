"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/search-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { youtubeSchema } from "@/validation";
import { useUser } from "@/hooks/useUser";
import { editYoutubeLink } from "@/lib/actions/Youtube.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type YoutubeFormValues = {
  youtubeLink: string;
  title: string;
};

const EditYoutubeLink = ({
  open,
  onOpenChange,

  id,
  url,
  title,
  abbreviation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  url: string;
  title: string;
  semester: string;
  abbreviation: string;
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

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

  const { mutate } = useMutation({
    // mutationFn is the function that performs the async action
    mutationFn: (values: YoutubeFormValues) =>
      editYoutubeLink({
        id,
        youtubeLink: values.youtubeLink,
        title: values.title,
      }),

    // onSuccess is called after the mutation succeeds
    onSuccess: () => {
      toast.success("YouTube link updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["youtube", abbreviation],
      });
      queryClient.invalidateQueries({
        queryKey: ["userYoutubeLinks", user!.name],
      });
      onOpenChange(false); // Close the modal
    },

    // onError is called if the mutation fails
    onError: (error) => {
      console.error("Error updating YouTube link:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleYoutubeEmbed = (values: YoutubeFormValues) => {
    mutate(values);
  };

  return (
    <>
      {(user?.role === "teacher" || user?.role === "admin") && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="lg:max-w-xl">
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
                  className="mt-2 lg:mt-0 px-3 w-full md:w-fit"
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

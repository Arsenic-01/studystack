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
import { googleFormSchema } from "@/components/validation_schema/validation";
import { useAuthStore } from "@/store/authStore";
import { IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";
import { createFormLink } from "@/lib/actions/Form.actions";

const GoogleFormModal = ({ subjectId }: { subjectId: string }) => {
  const { user, isLoggedIn } = useAuthStore();
  console.log(subjectId);

  // Initialize form with react-hook-form and Zod validation
  const form = useForm({
    resolver: zodResolver(googleFormSchema),
    defaultValues: {
      googleFormLink: "",
    },
  });

  // Handle form submission
  const handleGoogleFormEmbed = async (values: { googleFormLink: string }) => {
    if (!user?.name) {
      toast.error("You must be logged in to embed a Google Form.");
      return;
    }
    try {
      const payload = {
        googleFormLink: values.googleFormLink,
        createdBy: user.name, // Ensure user name is included
        subjectId: subjectId,
      };

      console.log(payload);

      const response = await createFormLink(payload);
      console.log(response);

      toast.success("Google Form link uploaded successfully");
      form.reset(); // Reset form on success
    } catch (error) {
      console.error("Error uploading Google Form link:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full" size="icon" variant="outline">
              <IconBrandGoogle />
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
                className="flex gap-2 justify-between items-center"
              >
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

export default GoogleFormModal;
